import * as successMsg from "../constants/success.messages";
import { parseError } from "../utils/error.util";
import * as attrServices from "../services/attributes.services";

export const getAllAttributes = async (req, res, next) => {
  let attr;
  try {
    attr = await attrServices.getAllAttributes();
  } catch (error) {
    return next(parseError(error));
  }
  return res.status(200).json({ payload: attr });
};

export const getAttributeByKey = async (req, res, next) => {
  let attr;
  try {
    attr = await attrServices.getAttributeByKey(req.params.aKey, true);
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json({ payload: attr });
};

export const createAttribute = async (req, res, next) => {
  let attr;
  try {
    attr = await attrServices.createAttribute(req.body);
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json({ payload: attr });
};

export const deleteAttribute = async (req, res, next) => {
  try {
    await attrServices.deleteAttribute(req.params.aKey);
  } catch (error) {
    return next(parseError(error));
  }

  return res
    .status(200)
    .json({ message: successMsg.succDeletedItem("attribute") });
};

export const updateAttribute = async (req, res, next) => {
  let updatedAttr;
  try {
    updatedAttr = await attrServices.updateAttribute({
      ...req.body,
      aKey: req.params.aKey,
    });
  } catch (error) {
    return next(parseError(error));
  }
  return res.status(200).json({ payload: updatedAttr });
};
