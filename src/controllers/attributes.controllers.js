import { Attribute } from "../models/flag.models";
import * as errorMsg from "../constants/error.messages";
import * as successMsg from "../constants/success.messages";
import HttpError from "../models/http-error";
import { parseError } from "../utils/error.util";

export const getAllAttributes = async (req, res, next) => {
  let attr;
  try {
    attr = await Attribute.findAll({
      attributes: { exclude: ["id"] },
      order: [["aKey", "ASC"]],
    });
  } catch (error) {
    return next(parseError(error));
  }
  return res.status(200).json({ payload: attr });
};

export const getAttributeByKey = async (req, res, next) => {
  const attrKey = req.params.aKey;
  let attr;
  try {
    attr = await Attribute.findOne({
      where: { aKey: attrKey },
      attributes: { exclude: ["id"] },
    });
    if (attr === null) {
      throw new HttpError(errorMsg.noAttrErrorMsg(attrKey), 404);
    }
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json({ payload: attr });
};

export const createAttribute = async (req, res, next) => {
  let attr;
  try {
    let newAttr = await Attribute.create(
      { ...req.body },
      { fields: ["aKey", "name", "type"] }
    );
    attr = newAttr.get({ plain: true });
    delete attr.id;
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json({ payload: attr });
};

export const deleteAttribute = async (req, res, next) => {
  const attrKey = req.params.aKey;

  try {
    let rowsImpacted = await Attribute.destroy({
      where: {
        aKey: attrKey,
      },
    });
    if (rowsImpacted === 0) {
      throw new HttpError(errorMsg.noAttrErrorMsg(attrKey), 404);
    }
  } catch (error) {
    return next(parseError(error));
  }

  return res
    .status(200)
    .json({ message: successMsg.succDeletedItem("attribute") });
};

export const updateAttribute = async (req, res, next) => {
  const attrKey = req.params.aKey;

  let updatedAttr;
  try {
    let attr = await Attribute.findOne({ where: { aKey: attrKey } });

    if (attr === null) {
      throw new HttpError(errorMsg.noAttrErrorMsg(attrKey), 404);
    }

    attr.set({ name: req.body.name });
    await attr.save();

    updatedAttr = attr.toJSON();
    delete updatedAttr.id;
  } catch (error) {
    return next(parseError(error));
  }
  return res.status(200).json({ payload: updatedAttr });
};
