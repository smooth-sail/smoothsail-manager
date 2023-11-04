import "dotenv/config";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.SDKKEYSDB,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
    // logging: (...msg) => console.log(msg), // might change this or delete (depending on what logging we want);
  }
);

export default sequelize;
