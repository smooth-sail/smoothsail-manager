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
    },
    // f_key: {},
    // title: {},
    // description: {}, // if only data type for column, simplify:  name: DataTypes.STRING
    // is_active: {},
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      timezone: true,
      allowNull: false,
    },
    // updated_at: {},
  },
  {
    sequelize,
    modelName: "Flag",
  }
);
// await sequelize.sync(); // This creates all tables if they don't exist (and does nothing if they already exist)
// console.log("All models were synchronized successfully.");

// id serial PRIMARY KEY,
// f_key varchar(20) NOT NULL UNIQUE CHECK (f_key ~ '^[A-Za-z0-9._-]+$'),
// title varchar(100) NOT NULL DEFAULT '',
// description text,
// is_active boolean DEFAULT false NOT NULL,
// created_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
// updated_at timestamp with time zone NOT NULL DEFAULT current_timestamp

export const getDBClient = async () => {
  try {
    const dbClient = await sequelize.authenticate();
    console.log("Sequelize: Connection has been established successfully.");
    return dbClient;
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};
