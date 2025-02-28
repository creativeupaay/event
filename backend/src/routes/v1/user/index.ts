import { Router } from "express";
import userRouter from "./userRoutes";
import eventRoutes from "./eventRoutes";
import friendRoutes from "./friendManagementRoutes";
import notificationRoutes from "./notificationRoutes";
import recentSearchRoutes from "./recentSearchRoutes";

const router = Router();

router.use("/", userRouter);
router.use("/events",eventRoutes);
router.use("/friend-management", friendRoutes);
router.use("/notification", notificationRoutes);
router.use("/recent-search", recentSearchRoutes);

export default router;