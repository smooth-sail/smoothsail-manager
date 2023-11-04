import "dotenv/config";
import { DataTypes } from "sequelize";
import sequelize from "./sequelize.sdk.key.instance";

const SdkKey = sequelize.define(
  "SdkKey",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    sdkKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: "sdk_key",
      validate: {
        is: /^[a-z0-9-]+$/i,
        len: [1, 100],
      },
    },
    initVector: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: "init_vector",
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

export { SdkKey, sequelize };
