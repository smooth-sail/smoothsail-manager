import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Attribute = sequelize.define(
    "Attribute",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      aKey: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        field: "a_key",
        validate: {
          is: /^[a-z0-9._-]+$/i,
          len: [1, 20],
        },
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "",
        validate: {
          len: [0, 100],
        },
      },
      type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "string",
        validate: {
          len: [1, 20],
          is: /^(boolean|string|number)$/i,
        },
        set(val) {
          this.setDataValue("type", val.toLowerCase());
        },
      },
    },
    {
      sequelize,
      tableName: "attributes",
      timestamps: false,
    }
  );
  return Attribute;
};
