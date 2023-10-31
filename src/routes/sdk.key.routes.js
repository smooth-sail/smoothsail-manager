import express from "express";
import * as keysControllers from "../controllers/sdk.key.controllers";

const router = express.Router();

router.get("/", keysControllers.getCurrentKey);
router.post("/generate", keysControllers.regenerateKey);

export default router;
