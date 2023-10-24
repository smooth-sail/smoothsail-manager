import "dotenv/config";
import express from "express";
import cors from "cors";
import apiRouter from "./routes/Api.routes";

const app = express();
app.use(cors()); // this should be later replaced with whitelisted domains
app.use(express.json());

app.use("/api", apiRouter);

app.use("/", (req, res) => {
  res.status(404).json({ error: "no such route" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

export default app;
