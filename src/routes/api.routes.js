import express from "express";
import * as mainControllers from "../controllers/flags.controller";

const router = express.Router();

// Flag API routes
router.get("/flags", mainControllers.getAllFlags);
router.get("/flags/:fKey", mainControllers.getFlagById);
router.post("/flags", mainControllers.createFlag);
router.delete("/flags/:fKey", mainControllers.deleteFlag);
router.patch("/flags/:fKey", mainControllers.updateFlag);

// Segment API routes
router.get("/segments", mainControllers.getAllSegments);
router.get("/segments/:sKey", mainControllers.getSegmentByKey);
router.post("/segments", mainControllers.createSegment);
router.delete("/segments/:sKey", mainControllers.deleteSegment);
router.patch("/segments/:sKey", mainControllers.updateSegment);

// Attributes API routes
router.get("/attributes", mainControllers.getAllAttributes);
router.get("/attributes/:aKey", mainControllers.getAttributeByKey);
router.post("/attributes", mainControllers.createAttribute);
router.delete("/attributes/:aKey", mainControllers.deleteAttribute);
router.put("/attributes/:aKey", mainControllers.updateAttribute);

export default router;
