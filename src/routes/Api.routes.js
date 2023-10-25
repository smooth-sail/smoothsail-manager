import express from "express";
import * as flagsController from "../controllers/flags.controller";
import * as segmentsController from "../controllers/segments.controller";
import * as attributesController from "../controllers/attributes.controller";

const router = express.Router();

// Flag API routes
router.get("/flags", flagsController.getAllFlags);
router.get("/flags/:id", flagsController.getFlagById);
router.post("/flags", flagsController.createFlag);
router.delete("/flags/:id", flagsController.deleteFlag);
router.put("/flags/:id", flagsController.updateFlag);

// Segment API routes
router.get("/segments", segmentsController.getAllSegments);
router.get("/segment/:id", segmentsController.getSegmentById);
router.post("/segments", segmentsController.createSegment);
router.delete("/segments/:id", segmentsController.deleteSegment);
router.patch("/segments/:id", segmentsController.updateSegment);

// Attributes API routes
router.get("/attributes", attributesController.getAllAttributes);
router.get("/attribute/:id", attributesController.getAttributeById);
router.post("/attributes", attributesController.createAttribute);
router.delete("/attributes/:id", attributesController.deleteAttribute);
router.patch("/attributes/:id", attributesController.updateAttribute);

// SSE API routes
router.get("/ff-updates-stream", mainControllers.sseNotifications);

export default router;
