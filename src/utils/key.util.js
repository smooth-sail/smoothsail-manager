import crypto from "crypto";
import { KEY_BITE_LEN } from "../constants";

export const generateKey = () => {
  return crypto.randomBytes(KEY_BITE_LEN).toString("hex");
};

// this needs to be saved in an .env somehow or saved in database.
const SECRET_KEY = crypto.randomBytes(32);

const createCipher = (iv) => {
  return crypto.createCipheriv("aes-256-cbc", SECRET_KEY, iv);
};

const createDecipher = (iv) => {
  return crypto.createDecipheriv("aes-256-cbc", SECRET_KEY, iv);
};

export const encryptKey = (key, iv) => {
  const cipher = createCipher(iv);
  let encryptedString = cipher.update(key, "utf8", "hex");
  encryptedString += cipher.final("hex");
  return encryptedString;
};

export const decryptKey = (encryptedKey, iv) => {
  const decipher = createDecipher(iv);
  let decryptedString = decipher.update(encryptedKey, "hex", "utf8");
  decryptedString += decipher.final("utf-8");
  return decryptedString;
};
