import { Router } from "express";
import userRouter from "./userRoutes";
import eventRoutes from "./eventRoutes";
import friendRoutes from "./friendManagementRoutes"

const router = Router();

router.use("/", userRouter);
router.use("/events",eventRoutes);
router.use("/friend-management", friendRoutes);

export default router;