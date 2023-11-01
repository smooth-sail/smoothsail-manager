import { SdkKey, sequelize } from "../models/SdkKey";
import { createEncryptedSdk, decryptSdk } from "../utils/key.util";

export const getCurrentKey = async (req, res) => {
  let payload;
  try {
    let keys = await SdkKey.findAll({
      attributes: { exclude: ["id", "updatedAt", "deletedAt"] },
    });
    if (keys.length === 0) {
      let newKey = await SdkKey.create(createEncryptedSdk(), {
        fields: ["sdkKey", "initVector"],
      });
      payload = decryptSdk(newKey.sdkKey, newKey.initVector);
    } else {
      payload = decryptSdk(keys[0].sdkKey, keys[0].initVector);
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
      let newKey = await SdkKey.create(createEncryptedSdk(), {
        fields: ["sdkKey", "initVector"],
        transaction: t,
      });
      return decryptSdk(newKey.sdkKey, newKey.initVector);
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ payload });
};
