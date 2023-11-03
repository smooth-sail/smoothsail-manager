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

  return sdkKey === keys[0].sdkKey;
};

console.log(
  "2a593abe9d4604bfaaba6a2b258816dfc818d1851462e84d36694b450d5e4b4abe917766ebc54bb9aa4930af12ec5907"
);
(async () => {
  console.log(
    await isValidSdk(
      "2a593abe9d4604bfaaba6a2b258816dfc818d1851462e84d36694b450d5e4b4abe917766ebc54bb9aa4930af12ec5907"
    )
  );
})();
