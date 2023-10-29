import { AckPolicy } from "nats";

export const FLAG_STREAM_CONFIG = {
  name: "FLAG_DATA",
  subjects: ["FLAG_DATA.*"],
  storage: "memory",
  max_msgs: 1,
};

export const FLAG_STREAM_CONSUMER_CONFIG = {
  durable_name: "FlagDataStream",
  ack_policy: AckPolicy.Explicit,
};
