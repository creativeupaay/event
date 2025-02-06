import express from "express";
import { authenticate } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as userEventController from "../../../controllers/user/event";

const router = express.Router();

router.route("/get-all-event-Guest").get(authenticate, asyncHandler(userEventController.getAllEventGuest))
router.route("/get-events").get(authenticate, asyncHandler(userEventController.getUserEvents));

export default router;