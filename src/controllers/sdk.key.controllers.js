import { SdkKey, sequelize } from "../models/SdkKey";
import {
  generateKey,
  generateInitVector,
  encryptSdk,
  decryptSdk,
} from "../utils/key.util";

export const getCurrentKey = async (req, res) => {
  let payload;
  try {
    let keys = await SdkKey.findAll({
      attributes: { exclude: ["id", "updatedAt", "deletedAt"] },
    });
    if (keys.length === 0) {
      const sdkKey = generateKey();
      const initVector = generateInitVector();
      const encryptedKey = encryptSdk(sdkKey, initVector);

      let newKey = await SdkKey.create(
        { sdkKey: encryptedKey, initVector },
        { fields: ["sdkKey", "initVector"] }
      );

      const decryptedKey = decryptSdk(newKey.sdkKey, newKey.initVector);
      payload = decryptedKey;
    } else {
      const decryptedKey = decryptSdk(keys[0].sdkKey, keys[0].initVector);
      payload = decryptedKey;
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal error occurred." });
  }

  return res.status(200).json({ payload });
};

export const regenerateKey = async (req, res) => {
  let payload;

  try {
    payload = await sequelize.transaction(async (t) => {
      await SdkKey.destroy({
        truncate: true,
        transaction: t,
      });
      const sdkKey = generateKey();
      const initVector = generateInitVector();
      const encryptedKey = encryptSdk(sdkKey, initVector);

      let newKey = await SdkKey.create(
        { sdkKey: encryptedKey, initVector },
        { fields: ["sdkKey", "initVector"], transaction: t }
      );
      const decryptedKey = decryptSdk(newKey.sdkKey, newKey.initVector);
      return decryptedKey;
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ payload });
};
