import express from "express";
import * as mainControllers from "../controllers/flags.controller";
// import * as flagsController from "../controllers/flags.controller";
// import * as segmentsController from "../controllers/segments.controller";
import * as attributesController from "../controllers/attributes.controller";

const router = express.Router();

// Flag API routes
router.get("/flags", mainControllers.getAllFlags);
router.get("/flags/:f_key", mainControllers.getFlagById);
router.post("/flags", mainControllers.createFlag);
router.delete("/flags/:f_key", mainControllers.deleteFlag);
router.patch("/flags/:f_key", mainControllers.updateFlag);

// Segment API routes
router.get("/segments", mainControllers.getAllSegments);
router.get("/segments/:s_key", mainControllers.getSegmentByKey);
router.post("/segments", mainControllers.createSegment);
router.delete("/segments/:s_key", mainControllers.deleteSegment);
router.patch("/segments/:s_key", mainControllers.updateSegment);

// Attributes API routes
router.get("/attributes", attributesController.getAllAttributes);
router.get("/attributes/:a_key", attributesController.getAttributeByKey);
router.post("/attributes", attributesController.createAttribute);
router.delete("/attributes/:a_key", attributesController.deleteAttribute);
router.patch("/attributes/:a_key", attributesController.updateAttribute);

// SSE API routes
router.get("/ff-updates-stream", mainControllers.sseNotifications);

export default router;
