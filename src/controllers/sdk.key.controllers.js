import { SdkKey, sequelize } from "../models/SdkKey";
import { parseError } from "../utils/error.util";
import { createEncryptedSdk, decryptSdk } from "../utils/key.util";
import jsm from "../nats/JetStreamManager";

export const getCurrentKey = async (req, res, next) => {
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
    return next(parseError(error));
  }

  return res.status(200).json({ payload });
};

export const regenerateKey = async (req, res, next) => {
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
    return next(parseError(error));
  }

  jsm.publishSdkUpdate();
  res.status(200).json({ payload });
};
