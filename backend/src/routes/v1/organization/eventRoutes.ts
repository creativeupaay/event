import express from "express";
import { authenticate } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as eventController from "../../../controllers/organization/event";

const router = express.Router();

router.route("/create").post(authenticate, asyncHandler(eventController.createEvent))
router.route("/").get(authenticate, asyncHandler(eventController.getAllEvents));
router.route("/publish").put(authenticate, asyncHandler(eventController.handlePublishQR));
router.route("/edit").put(authenticate, asyncHandler(eventController.updateEvent));
router.route("/delete").delete(authenticate, asyncHandler(eventController.deleteEvent));
router.route("/fetch").get(authenticate, asyncHandler(eventController.getEventById));
router.route("/edit-attendee-roles").put(authenticate, asyncHandler(eventController.updateAttendeeRoles));


export default router;