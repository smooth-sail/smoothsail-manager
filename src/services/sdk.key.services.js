import { SdkKey, sequelize } from "../models/SdkKey";
import { createEncryptedSdk, decryptSdk } from "../utils/key.util";

export const getSdkKey = async () => {
  let result;
  let keys = await SdkKey.findAll({
    attributes: { exclude: ["id", "updatedAt", "deletedAt"] },
  });
  if (keys.length === 0) {
    let newKey = await SdkKey.create(createEncryptedSdk(), {
      fields: ["sdkKey", "initVector"],
    });
    result = decryptSdk(newKey.sdkKey, newKey.initVector);
  } else {
    result = decryptSdk(keys[0].sdkKey, keys[0].initVector);
  }
  return result;
};

export const generateNewSdkKey = async () => {
  let result = await sequelize.transaction(async (t) => {
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
  return result;
};
