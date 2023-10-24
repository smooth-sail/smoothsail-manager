import pg from "../db/attributes";
import Attribute from "../models/attributes";

export const getAllAttributes = async (req, res) => {
  let attributes;
  try {
    attributes = await pg.getAllAttributes();
  } catch (err) {
    res.status(500).json({ error: "Internal error occurred." });
  }

  res.status(200).json(attributes);
};

export const getAttributeByKey = async (req, res) => {
  const attributeKey = req.params.a_key;

  let attribute;
  try {
    attribute = await pg.getAttribute(attributeKey);
  } catch (err) {
    res.status(500).json({ error: "Internal error occurred." });
  }

  if (!attribute) {
    res
      .status(404)
      .json({ error: `Attribute with key '${attributeKey}' does not exist` });
  }

  res.status(200).json(attribute);
};

export const createAttribute = async (req, res) => {
  try {
    console.log(req.body);
    let newAttribute = new Attribute(req.body);
    console.log(newAttribute);
    let attribute = await pg.createAttribute(newAttribute);
    res.status(200).json(attribute);
  } catch (error) {
    res.status(500).json({ error: "Internal error occurred." });
  }
};

export const deleteAttribute = async (req, res) => {
  const attributeKey = req.params.a_key;

  let attribute;
  try {
    attribute = pg.deleteAttribute(attributeKey);
    if (!attribute) {
      res
        .status(404)
        .json({ error: `Attribute with id '${attributeKey}' does not exist.` });
      return;
    }

    res.status(200).json({ message: "Attribute successfully deleted." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal error occurred. Could not delete attribute." });
  }
};

export const updateAttribute = async (req, res) => {
  const attributeKey = req.params.a_key;

  let attribute;
  try {
    attribute = await pg.getAttribute(attributeKey);
  } catch (error) {
    res.status(500).json({ error: "Internal error occurred." });
  }

  if (!attribute) {
    res
      .status(404)
      .json({ error: `Attribute with id '${attributeKey}' does not exist.` });
  }

  let newAttribute = new Attribute(attribute);
  newAttribute.updateProps(req.body);
  try {
    let updatedAttribute = await pg.updateAttribute(attribute.id, newAttribute);
    res.status(200).json(updatedAttribute);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal error occurred. Could not update attribute." });
  }
};
