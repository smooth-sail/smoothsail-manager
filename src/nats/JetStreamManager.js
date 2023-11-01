import "dotenv/config";

import { connect, StringCodec, consumerOpts, createInbox } from "nats";

import {
  FLAG_STREAM_CONFIG,
  FLAG_STREAM_CONSUMER_CONFIG,
  // SDK_KEY_STREAM_CONFIG,
  // SDK_KEY_STREAM_CONSUMER_CONFIG,
} from "./constants";

import { getSdkFlags } from "../utils/flags.util";

class JetstreamManager {
  constructor() {
    this.nc = null;
    this.js = null;
    this.jsm = null;
    this.sc = StringCodec();
  }

  async initialize() {
    await this.connectToJetStream();

    // if (!(await this.streamExists("SDK_KEY"))) {
    //   await this.addStream(SDK_KEY_STREAM_CONFIG);
    //   await this.addConsumers("SDK_KEY", SDK_KEY_STREAM_CONSUMER_CONFIG);
    // }

    // await this.subscribeToStream(
    //   "SDK_KEY",
    //   "REQUEST_SDK_KEY",
    //   this.handleSdkKeyRequest
    // )

    if (!(await this.streamExists("FLAG_DATA"))) {
      await this.addStream(FLAG_STREAM_CONFIG);
      await this.addConsumers("FLAG_DATA", FLAG_STREAM_CONSUMER_CONFIG);
    }

    await this.subscribeToStream(
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

  addStream(config) {
    this.jsm.streams.add(config);
  }

  async addConsumers(stream, config) {
    await this.jsm.consumers.add(stream, config);
  }

  async publishFlagUpdate(msg) {
    const json = JSON.stringify(msg);
    const encodedMessage = this.sc.encode(json);

    await this.js
      .publish("FLAG_DATA.FLAG_UPDATE", encodedMessage)
      .catch((err) => {
        throw Error(
          err,
          "NATS Jetstream: Publish message has failed. Check your connection."
        );
      });
  }

  async publishFlagData() {
    const data = await getSdkFlags();
    const json = JSON.stringify(data);
    await this.js
      .publish("FLAG_DATA.GET_ALL_FLAGS", this.sc.encode(json))
      .catch((err) => {
        throw Error(
          err,
          "NATS Jetstream: Publish message has failed. Check your connection."
        );
      });
  }

  // async publishSdkKey() {
  //   // const data = await getSdkKey();
  //   // const json = JSON.stringify(data);
  //   await this.js
  //     .publish("SDK_KEY.GET_SDK_KEY", this.sc.encode(json))
  //     .catch((err) => {
  //       throw Error(
  //         err,
  //         "NATS Jetstream: Publish message has failed. Check your connection."
  //       );
  //     });
  // }

  async subscribeToStream(stream, subject, callbackFn) {
    await this.js.subscribe(
      `${stream}.${subject}`,
      this.createConfig(subject, callbackFn)
    );
  }

  async handleFlagsRequest(err, msg) {
    if (err) {
      console.error("Error:", err);
    } else {
      this.publishFlagData();
      msg.ack();
    }
  }

  // async handleSdkKeyRequest(err, msg) {
  //   if (err) {
  //     console.error("Error:", err);
  //   } else {
  //     this.publishSdkKey();
  //     msg.ack();
  //   }
  // }

  createConfig(subject, callbackFn) {
    const opts = consumerOpts();

    opts.deliverTo(createInbox());
    opts.durable(subject);
    callbackFn && opts.callback(callbackFn.bind(this));
    opts.manualAck();

    return opts;
  }

  async streamExists(streamName) {
    try {
      const stream = await this.jsm.streams.info(streamName);
      return stream.config.name === streamName;
    } catch (err) {
      return false;
    }
  }
}

// Create an instance of the JetstreamManager class
const jsm = new JetstreamManager();

// Call the `initialize` method to start the initialization process
(async () => {
  await jsm.initialize();
})();

export default jsm;
