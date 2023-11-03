import "dotenv/config";

import { connect, StringCodec, consumerOpts, createInbox } from "nats";

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
    await this.connectToJetStream();
    await this.createStreams();
    this.replyToSdkValidation();
    this.subscribeToStream(
      "FLAG_DATA",
      "REQUEST_ALL_FLAGS",
      this.handleFlagsRequest
    );
  }

  async connectToJetStream() {
    this.nc = await connect({ servers: process.env.NATS_SERVER });
    this.js = this.nc.jetstream();
    this.jsm = await this.nc.jetstreamManager();
  }

  async streamExists(streamName) {
    try {
      const stream = await this.jsm.streams.info(streamName);
      return stream.config.name === streamName;
    } catch (err) {
      return false;
    }
  }

  async createStreams() {
    if (!(await this.streamExists("SDK_KEY"))) {
      await this.jsm.streams.add(SDK_KEY_STREAM_CONFIG);
      await this.jsm.consumers.add("SDK_KEY", SDK_KEY_STREAM_CONSUMER_CONFIG);
    }

    if (!(await this.streamExists("FLAG_DATA"))) {
      await this.jsm.streams.add(FLAG_STREAM_CONFIG);
      await this.jsm.consumers.add("FLAG_DATA", FLAG_STREAM_CONSUMER_CONFIG);
    }
  }

  createConfig(subject, callbackFn) {
    const opts = consumerOpts();

    opts.deliverNew();
    opts.deliverTo(createInbox());
    opts.durable(subject);
    callbackFn && opts.callback(callbackFn.bind(this));
    opts.manualAck();

    return opts;
  }

  async subscribeToStream(stream, subject, callbackFn) {
    await this.js.subscribe(
      `${stream}.${subject}`,
      this.createConfig(subject, callbackFn)
    );
  }

  async _publish(fullSubject, message) {
    try {
      await this.createStreams();
      await this.js.publish(fullSubject, message);
    } catch (err) {
      console.error(err);
    }
  }

  async publishFlagUpdate(msg) {
    const json = JSON.stringify(msg);
    const encodedMessage = this.sc.encode(json);
    await this._publish("FLAG_DATA.FLAG_UPDATE", encodedMessage);
  }

  async publishFlagData() {
    const data = await getSdkFlags();
    const json = JSON.stringify(data);
    await this._publish("FLAG_DATA.GET_ALL_FLAGS", this.sc.encode(json));
  }

  async publishSdkUpdate() {
    const data = { type: "reset-sdk" };
    const json = JSON.stringify(data);
    await this._publish("SDK_KEY.KEY_UPDATE", this.sc.encode(json));
  }

  async replyToSdkValidation() {
    const subscription = this.nc.subscribe("SDK_KEY");

    (async (sub) => {
      for await (const m of sub) {
        this.handleSdkKeyRequest(m);
      }
    })(subscription);
  }

  async handleFlagsRequest(err, msg) {
    if (err) {
      console.error("Error:", err);
    } else {
      this.publishFlagData();
      msg.ack();
    }
  }

  async handleSdkKeyRequest(msg) {
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
