import express from "express";
import * as flagControllers from "../controllers/flags.controllers";
import * as segmControllers from "../controllers/segments.controllers";
import * as attrControllers from "../controllers/attributes.controllers";

const router = express.Router();

// Flag API routes
router.get("/flags", flagControllers.getAllFlags);
router.get("/flags/:fKey", flagControllers.getFlagById);
router.post("/flags", flagControllers.createFlag);
router.delete("/flags/:fKey", flagControllers.deleteFlag);
router.patch("/flags/:fKey", flagControllers.updateFlag);

// Segment API routes
router.get("/segments", segmControllers.getAllSegments);
router.get("/segments/:sKey", segmControllers.getSegmentByKey);
router.post("/segments", segmControllers.createSegment);
router.delete("/segments/:sKey", segmControllers.deleteSegment);
router.patch("/segments/:sKey", segmControllers.updateSegment);

// Attributes API routes
router.get("/attributes", attrControllers.getAllAttributes);
router.get("/attributes/:aKey", attrControllers.getAttributeByKey);
router.post("/attributes", attrControllers.createAttribute);
router.delete("/attributes/:aKey", attrControllers.deleteAttribute);
router.put("/attributes/:aKey", attrControllers.updateAttribute);

export default router;
