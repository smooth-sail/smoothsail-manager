import { SdkKey, sequelize } from "../models/SdkKey";
import { generateKey } from "../utils/key.generator";

export const getCurrentKey = async (req, res) => {
  let payload;
  try {
    let keys = await SdkKey.findAll({
      attributes: { exclude: ["id", "updated_at", "deleted_at"] },
    });
    if (keys.length === 0) {
      let newKey = await SdkKey.create(
        { sdkKey: generateKey() },
        { fieds: ["sdkKey"] }
      );
      payload = newKey.sdkKey;
    } else {
      payload = keys[0].sdkKey;
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

      let newKey = await SdkKey.create(
        { sdkKey: generateKey() },
        { fieds: ["sdkKey"], transaction: t }
      );
      return newKey.sdkKey;
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ payload });
};
