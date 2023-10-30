import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Segment = sequelize.define(
    "Segment",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      sKey: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        field: "s_key",
        validate: {
          is: /^[a-z0-9._-]+$/i,
          len: [1, 20],
        },
      },
      title: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
          len: [1, 100],
        },
      },
      description: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false,
      },
      rulesOperator: {
        type: DataTypes.STRING(3),
        allowNull: false,
        field: "rules_operator",
        defaultValue: "all",
        validate: {
          len: [3, 3],
          is: /^(all|any)$/i,
        },
        set(val) {
          this.setDataValue("rulesOperator", val.toLowerCase());
        },
      },
    },
    {
      sequelize,
      tableName: "segments",
      timestamps: false,
    }
  );
  return Segment;
};
