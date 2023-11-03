import { Attribute } from "../models/flag.models";
import HttpError from "../models/http-error";
import * as errorMsg from "../constants/error.messages";

export const getAllAttributes = async () => {
  return await Attribute.findAll({
    attributes: { exclude: ["id"] },
    order: [["aKey", "ASC"]],
  });
};

export const getAttributeByKey = async (aKey, format) => {
  let attr = await Attribute.findOne({
    where: { aKey: aKey },
  });

  if (attr === null) {
    throw new HttpError(errorMsg.noAttrErrorMsg(aKey), 404);
  }
  if (format) {
    attr = attr.toJSON();
    delete attr.id;
  }
  return attr;
};

export const createAttribute = async ({ aKey, name, type }) => {
  let attr = await Attribute.create(
    { aKey, name, type },
    { fields: ["aKey", "name", "type"] }
  );
  attr = attr.get({ plain: true });
  delete attr.id;
  return attr;
};

export const deleteAttribute = async (aKey) => {
  let rowsImpacted = await Attribute.destroy({
    where: {
      aKey,
    },
  });
  if (rowsImpacted === 0) {
    throw new HttpError(errorMsg.noAttrErrorMsg(aKey), 404);
  }
};

export const updateAttribute = async ({ aKey, name }) => {
  let attr = await Attribute.findOne({ where: { aKey } });

  if (attr === null) {
    throw new HttpError(errorMsg.noAttrErrorMsg(aKey), 404);
  }

  attr.set({ name });
  await attr.save();

  attr = attr.toJSON();
  delete attr.id;
  return attr;
};
