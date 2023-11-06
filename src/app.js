import "dotenv/config";
import express from "express";
import cors from "cors";
import apiRouter from "./routes/api.routes";
import keyRouter from "./routes/sdk.key.routes";
import HttpError from "./models/http-error";
import * as errorMsg from "./constants/error.messages";
import { sequelize as dfFeatFlagInfo } from "./models/flag.models";
import { sequelize as dbSdkKey } from "./models/SdkKey";

const app = express();
app.use(cors()); // this should be later replaced with whitelisted domains
app.use(express.json());

app.use("/api", apiRouter);
app.use("/key", keyRouter);

app.use("/", (req, res, next) => {
  return next(new HttpError("Route does not exist.", 404));
});

app.use((error, req, res, next) => {
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
        console.log(`Feature Flag Manager is listening on port ${PORT}!`)
      );
    } catch (error) {
      // log the error properly
      console.log(
        "Unable to connect to one or both databases: ",
        error.message
      );
      process.exit(1);
    }
  }
};

authenticateDatabases();

export default app;
