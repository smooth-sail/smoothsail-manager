import { DataTypes } from "sequelize";

export default (sequelize, Attribute, Segment) => {
  const Rule = sequelize.define(
    "Rule",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      rKey: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
        field: "r_key",
      },
      operator: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "operator",
        set(val) {
          this.setDataValue("operator", val.toString().toLowerCase());
        },
      },
      value: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: [1, 100],
        },
      },
      AttributeId: {
        type: DataTypes.INTEGER,
        field: "attribute_id",
        references: {
          model: Attribute,
          key: "id",
        },
      },
      SegmentId: {
        type: DataTypes.INTEGER,
        field: "segment_id",
        references: {
          model: Segment,
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "rules",
      timestamps: false,
    }
  );
  return Rule;
};
