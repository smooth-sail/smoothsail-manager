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

export const SDK_KEY_STREAM_CONFIG = {
  name: "SDK_KEY",
  subjects: ["SDK_KEY.*"],
  storage: "memory",
  max_msgs: 1,
};

export const SDK_KEY_STREAM_CONSUMER_CONFIG = {
  durable_name: "SdkKeyStream",
  ack_policy: AckPolicy.Explicit,
};

export const KEY_BITE_LEN = 20;
export const IV_BYTE_LEN = 16;
