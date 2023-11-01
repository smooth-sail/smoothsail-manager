import crypto from "crypto";
import { KEY_BITE_LEN } from "../constants";
export const generateKey = () => {
  return crypto.randomBytes(KEY_BITE_LEN).toString("hex");
};
