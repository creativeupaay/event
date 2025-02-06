import { Router } from "express";
import { authenticate } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as friendManagementController from "../../../controllers/user/friendManagement";


const router = Router();

router.route("/request-sended").get(authenticate, asyncHandler(friendManagementController.getRequestSended));
router.route("/request-recieved").get(authenticate, asyncHandler(friendManagementController.getRequestRecieved));
router.route("/friend-request-Sent").post(authenticate, asyncHandler(friendManagementController.sendFriendRequest))
router.route("/accept-reject-friend-request").post(authenticate, asyncHandler(friendManagementController.acceptRequestReceived));
router.route("/get-all-friends").get(authenticate, asyncHandler(friendManagementController.getAllFriends));
router.route("/unfollow").delete(authenticate, asyncHandler(friendManagementController.unfollowFriend));
router.route("/withdraw-friend-request").delete(authenticate, asyncHandler(friendManagementController.withdrawFriendRequest));

router.route("/friend-profile").get(authenticate, asyncHandler(friendManagementController.friendProfileById))

export default router;
