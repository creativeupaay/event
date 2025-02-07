import { Router } from "express";
import asyncHandler from "../../../utils/asyncHandler";
import * as UserController from "../../../controllers/user/user";
import { authenticate } from "../../../middlewares/authenticate";

const router = Router();

router.route("/create").post(asyncHandler(UserController.createUser))
router.route("/").get(authenticate, asyncHandler(UserController.UserInfo));
router.route("/edit").put(authenticate,asyncHandler(UserController.updateUser));
router.route("/editInterest").put(authenticate, asyncHandler(UserController.updateInterest));
router.route("/edit-lookingFor").put(authenticate, asyncHandler(UserController.updateLookingFor));
router.route("/edit-profile-picture").put(authenticate, asyncHandler(UserController.editProfilePicture));


export default router;
