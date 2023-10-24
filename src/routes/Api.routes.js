import express from "express";
import * as flagsController from "../controllers/flags.controller";
import * as segmentsController from "../controllers/segments.controller";
import * as attributesController from "../controllers/attributes.controller";

const router = express.Router();

// Flag API routes
router.get("/flags", flagsController.getAllFlags);
router.get("/flags/:f_key", flagsController.getFlagById);
router.post("/flags", flagsController.createFlag);
router.delete("/flags/:f_key", flagsController.deleteFlag);
router.patch("/flags/:f_key", flagsController.updateFlag);

// Segment API routes
router.get("/segments", segmentsController.getAllSegments);
router.get("/segments/:s_key", segmentsController.getSegmentByKey);
router.post("/segments", segmentsController.createSegment);
router.delete("/segments/:s_key", segmentsController.deleteSegment);
router.patch("/segments/:s_key", segmentsController.updateSegment);

// Attributes API routes
router.get("/attributes", attributesController.getAllAttributes);
router.get("/attributes/:a_key", attributesController.getAttributeByKey);
router.post("/attributes", attributesController.createAttribute);
router.delete("/attributes/:a_key", attributesController.deleteAttribute);
router.patch("/attributes/:a_key", attributesController.updateAttribute);

// SSE API routes
router.get("/ff-updates-stream", flagsController.sseNotifications);

export default router;
