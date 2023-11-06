import "dotenv/config";
import winstonLogger from "../config/logger";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
    logging: (message) =>
      winstonLogger.verbose(`\x1b[36m[sequelize]\x1b[0m ${message}`),
  }
);

export default sequelize;
