import { parseError } from "../utils/error.util";
import jsm from "../nats/JetStreamManager";
import { getSdkKey, generateNewSdkKey } from "../services/sdk.key.services";

export const getCurrentKey = async (req, res, next) => {
  let payload;
  try {
    payload = await getSdkKey();
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json({ payload });
};

export const regenerateKey = async (req, res, next) => {
  let payload;
  try {
    payload = await generateNewSdkKey();
  } catch (error) {
    return next(parseError(error));
  }

  jsm.publishSdkUpdate();
  res.status(200).json({ payload });
};
