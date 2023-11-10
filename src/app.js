import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import winstonLogger from "./config/logger";
import apiRouter from "./routes/api.routes";
import keyRouter from "./routes/sdk.key.routes";
import HttpError from "./models/http-error";
import * as errorMsg from "./constants/error.messages";
import { sequelize as dfFeatFlagInfo } from "./models/flag.models";
import { sequelize as dbSdkKey } from "./models/SdkKey";

const app = express();

app.use(morgan("combined", { stream: winstonLogger.stream }));
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client/dist")));
app.use("/api", apiRouter);
app.use("/key", keyRouter);

app.use("/", (req, res, next) => {
  return next(new HttpError("Route does not exist.", 404));
});

app.use((error, req, res, next) => {
  if (error.code !== 500) {
    winstonLogger.error(
      `${error.code} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
    );
  }

  res.status(error.code || 500);
  res.json({ error: error.message || errorMsg.INTERNAL });
});

const PORT = process.env.PORT || 3000;
const authenticateDatabases = async () => {
  {
    try {
      await Promise.all([
        dfFeatFlagInfo.authenticate(),
        dbSdkKey.authenticate(),
      ]);
      await Promise.all([
        dfFeatFlagInfo.sync({ alter: true }),
        dbSdkKey.sync({ alter: true }),
      ]);
      app.listen(PORT, () =>
        winstonLogger.info(
          `SmoothSail dashboard is available at http://localhost:${PORT}`,
        ),
      );
    } catch (error) {
      winstonLogger.error(
        `Unable to connect to one or both databases: ${error.message}`,
      );
      process.exit(1);
    }
  }
};

authenticateDatabases();

export default app;
