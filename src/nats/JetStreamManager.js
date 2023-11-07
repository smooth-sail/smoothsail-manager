import "dotenv/config";
import logger from "../config/logger";
import { connect, StringCodec, consumerOpts, createInbox, Events } from "nats";

import {
  FLAG_STREAM_CONFIG,
  FLAG_STREAM_CONSUMER_CONFIG,
  SDK_KEY_STREAM_CONFIG,
  SDK_KEY_STREAM_CONSUMER_CONFIG,
} from "../constants/index";

import { getSdkFlags } from "../utils/flags.util";
import { isValidSdk } from "../utils/key.util";

class JetstreamManager {
  constructor() {
    this.sc = StringCodec();
  }

  async initialize() {
    await this._connectToJetStream();
    await this._createStreams();
    await this._replyToSdkValidation();
    await this._subscribeToStream(
      "FLAG_DATA",
      "REQUEST_ALL_FLAGS",
      this._handleFlagsRequest
    );
  }

  async _connectToJetStream() {
    this.nc = await connect({
      servers: process.env.NATS_SERVER,
      waitOnFirstConnect: true,
    });
    this.js = this.nc.jetstream();
    this.jsm = await this.nc.jetstreamManager();

    this._logConnectionEvents();
  }

  async _logConnectionEvents() {
    for await (const s of this.nc.status()) {
      const date = new Date().toLocaleString();
      switch (s.type) {
        case Events.Disconnect:
          logger.warn(
            `${date}: NATS Jetstream client disconnected from nats://${s.data}`
          );
          break;
        case Events.Reconnect:
          logger.info(
            `${date}: NATS Jetstream client reconnected to nats://${s.data}`
          );
          break;
        default:
      }
    }
  }

  async _streamExists(streamName) {
    try {
      const stream = await this.jsm.streams.info(streamName);
      return stream.config.name === streamName;
    } catch (err) {
      return false;
    }
  }

  async _createStreams() {
    if (!(await this._streamExists("SDK_KEY"))) {
      await this.jsm.streams.add(SDK_KEY_STREAM_CONFIG);
      await this.jsm.consumers.add("SDK_KEY", SDK_KEY_STREAM_CONSUMER_CONFIG);
    }

    if (!(await this._streamExists("FLAG_DATA"))) {
      await this.jsm.streams.add(FLAG_STREAM_CONFIG);
      await this.jsm.consumers.add("FLAG_DATA", FLAG_STREAM_CONSUMER_CONFIG);
    }
  }

  _createConfig(subject, callbackFn) {
    const opts = consumerOpts();

    opts.deliverNew();
    opts.deliverTo(createInbox());
    opts.durable(subject);
    callbackFn && opts.callback(callbackFn.bind(this));
    opts.manualAck();

    return opts;
  }

  async _subscribeToStream(stream, subject, callbackFn) {
    await this.js.subscribe(
      `${stream}.${subject}`,
      this._createConfig(subject, callbackFn)
    );
  }

  async _publish(fullSubject, message) {
    try {
      await this.js.publish(fullSubject, message);
    } catch (err) {
      logger.error(
        `Publish message unsuccessful, check your NATS Jetstream connection.`,
        err
      );
    }
  }

  async publishFlagUpdate(msg) {
    const json = JSON.stringify(msg);
    const encodedMessage = this.sc.encode(json);
    await this._publish("FLAG_DATA.FLAG_UPDATE", encodedMessage);
  }

  async _publishFlagData() {
    const data = await getSdkFlags();
    const json = JSON.stringify(data);
    await this._publish("FLAG_DATA.GET_ALL_FLAGS", this.sc.encode(json));
  }

  async publishSdkUpdate() {
    const data = { type: "reset-sdk" };
    const json = JSON.stringify(data);
    await this._publish("SDK_KEY.KEY_UPDATE", this.sc.encode(json));
  }

  async _replyToSdkValidation() {
    const subscription = this.nc.subscribe("SDK_KEY");

    (async (sub) => {
      for await (const m of sub) {
        this._handleSdkKeyRequest(m);
      }
    })(subscription);
  }

  async _handleFlagsRequest(err, msg) {
    if (err) {
      logger.error(err);
    } else {
      this._publishFlagData();
      msg.ack();
    }
  }

  async _handleSdkKeyRequest(msg) {
    const key = this.sc.decode(msg.data);
    const isValid = await isValidSdk(key);
    const json = JSON.stringify({ isValid });
    msg.respond(this.sc.encode(json));
  }
}

const jsm = new JetstreamManager();

(async () => {
  await jsm.initialize();
})();

export default jsm;
