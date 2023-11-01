import { Attribute, sequelize } from "../models/flag.models";

export const getAllAttributes = async (req, res) => {
  let attr;
  try {
    attr = await Attribute.findAll({
      attributes: { exclude: ["id"] },
      order: [["aKey", "ASC"]],
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal error occurred." });
  }
  return res.status(200).json({ payload: attr });
};

export const getAttributeByKey = async (req, res) => {
  const attrKey = req.params.aKey;
  let attr;
  try {
    attr = await Attribute.findOne({
      where: { aKey: attrKey },
      attributes: { exclude: ["id"] },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal error occurred." });
  }

  if (attr === null) {
    return res
      .status(404)
      .json({ error: `Attribute with id ${attrKey} does not exist.` });
  }
  return res.status(200).json({ payload: attr });
};

export const createAttribute = async (req, res) => {
  let attr;
  try {
    let newAttr = await Attribute.create(
      { ...req.body },
      { fields: ["aKey", "name", "type"] }
    );
    attr = newAttr.get({ plain: true });
    delete attr.id;
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal error occurred." });
  }

  return res.status(200).json({ payload: attr });
};

export const deleteAttribute = async (req, res) => {
  const attrKey = req.params.aKey;
  let rowsImpacted;
  try {
    rowsImpacted = await Attribute.destroy({
      where: {
        aKey: attrKey,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: "Internal error occurred. Could not delete the attribute.",
    });
  }

  if (rowsImpacted === 0) {
    res
      .status(404)
      .json({ error: `Attribute with id ${attrKey} does not exist.` });
    return;
  }

  return res.status(200).json({ message: "Attribute successfully deleted." });
};

export const updateAttribute = async (req, res) => {
  const attrKey = req.params.aKey;

  let updatedAttr;
  try {
    updatedAttr = await sequelize.transaction(async (t) => {
      let attr = await Attribute.findOne(
        {
          where: { aKey: attrKey },
        },
        { transaction: t }
      );

      if (attr === null) {
        throw new Error(`Attribute with id ${attrKey} does not exist.`);
      }

      attr.set({ name: req.body.name });
      await attr.save();
      return attr;
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }

  let plainAttr = updatedAttr.toJSON();
  delete plainAttr.id;
  return res.status(200).json({ payload: plainAttr });
};
