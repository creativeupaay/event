import { Router } from "express";
import asyncHandler from "../../../utils/asyncHandler";
import * as UserController from "../../../controllers/user/user";
import { authenticate } from "../../../middlewares/authenticate";

const router = Router();

router.route("/create").post(asyncHandler(UserController.createUser))
router.route("/").get(authenticate, asyncHandler(UserController.UserInfo));
router.route("/edit").put(authenticate,asyncHandler(UserController.updateUser));
router.route("/editInterest").put(authenticate, asyncHandler(UserController.updateInterest));


export default router;
