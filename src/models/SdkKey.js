import "dotenv/config";
import { Sequelize, DataTypes } from "sequelize";

export const sequelize = new Sequelize(
  process.env.SDKKEYSDB,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
    // logging: (...msg) => console.log(msg), // might change this or delete (depending on what logging we want);
  }
);
export const SdkKey = sequelize.define(
  "SdkKey",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    sdkKey: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: "sdk_key",
      validate: {
        is: /^[a-z0-9-]+$/i,
        len: [1, 50],
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      timezone: true,
      allowNull: false,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      timezone: true,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    sequelize,
    paranoid: true,
    deletedAt: "deleted_at",
    tableName: "sdk_keys",
  }
);
