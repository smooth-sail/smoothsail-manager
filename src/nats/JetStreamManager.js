import "dotenv/config";
import {
  connect,
  AckPolicy,
  JSONCodec,
  StringCodec,
  consumerOpts,
  createInbox,
} from "nats";

class JetstreamManager {
  constructor() {
    this.nc = null;
    this.js = null;
    this.jsm = null;
    this.sc = StringCodec();
    this.jc = JSONCodec();
  }

  async initialize() {
    await this.connectToJetStream();
    await this.addFlagStream();
    await this.addConsumers();
  }

  async connectToJetStream() {
    this.nc = await connect({ servers: process.env.NATS_SERVER });
    this.js = this.nc.jetstream();
    this.jsm = await this.nc.jetstreamManager();
  }

  addFlagStream() {
    this.jsm.streams.add({
      name: "FLAG_DATA",
      subjects: ["FLAG_DATA.*"],
      storage: "memory",
      max_msgs: 1,
    });
  }

  async addConsumers() {
    await this.jsm.consumers.add("FLAG_DATA", {
      durable_name: "FlagDataStream-1",
      ack_policy: AckPolicy.Explicit,
    });
  }

  publishString(stringMessage) {
    const encodedMessage = this.sc.encode(stringMessage);
    this.js.publish("FLAG_DATA.request", encodedMessage);
  }

  config(subject) {
    const opts = consumerOpts();
    opts.durable(subject);
    opts.manualAck();
    opts.ackExplicit();
    opts.deliverTo(createInbox());

    return opts;
  }
}

// Create an instance of the JetstreamManager class
const jsm = new JetstreamManager();

// Call the `initialize` method to start the initialization process
(async () => {
  await jsm.initialize();
})();

export default jsm;
