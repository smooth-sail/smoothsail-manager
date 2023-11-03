import "dotenv/config";
import crypto from "crypto";
import { KEY_BYTE_LEN, IV_BYTE_LEN } from "../constants";
import { SdkKey } from "../models/SdkKey";

export const generateKey = () => {
  return crypto.randomBytes(KEY_BYTE_LEN).toString("hex");
};

export const generateInitVector = () => {
  return crypto.randomBytes(IV_BYTE_LEN).toString("hex");
};

const createCipher = (iv) => {
  const ivInBytes = Buffer.from(iv, "hex");
  return crypto.createCipheriv(
    "aes-256-cbc",
    process.env.SECRET_KEY,
    ivInBytes
  );
};

const createDecipher = (iv) => {
  const ivInBytes = Buffer.from(iv, "hex");
  return crypto.createDecipheriv(
    "aes-256-cbc",
    process.env.SECRET_KEY,
    ivInBytes
  );
};

const encryptSdk = (key, iv) => {
  const cipher = createCipher(iv);
  let encryptedString = cipher.update(key, "utf8", "hex");
  encryptedString += cipher.final("hex");
  return encryptedString;
};

export const decryptSdk = (encryptedKey, iv) => {
  const decipher = createDecipher(iv);
  let decryptedString = decipher.update(encryptedKey, "hex", "utf8");
  decryptedString += decipher.final("utf-8");
  return `${iv}:${decryptedString}`;
};

export const createEncryptedSdk = () => {
  const sdkKey = generateKey();
  const initVector = generateInitVector();
  const encryptedKey = encryptSdk(sdkKey, initVector);
  return { sdkKey: encryptedKey, initVector };
};

export const isValidSdk = async (sdkKey) => {
  let keys = await SdkKey.findAll({
    attributes: { exclude: ["id", "updatedAt", "deletedAt"] },
  });
  const [key, iv] = sdkKey.split(":");

  let decrypted = decryptSdk(key, keys[0].initVector);
  return sdkKey === decrypted;
};
