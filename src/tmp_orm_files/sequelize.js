import "dotenv/config";
import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
    logging: (...msg) => console.log(msg), // might change this or delete (depending on what logging we want);
  }
);

const Flag = sequelize.define(
  "Flag",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    fKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: "f_key",
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
    },
    description: DataTypes.STRING,
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_active",
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
    modelName: "Flag",
    tableName: "flags",
  }
);

// need to add: f_key  CHECK (f_key ~ '^[A-Za-z0-9._-]+$'),

export default Flag;
