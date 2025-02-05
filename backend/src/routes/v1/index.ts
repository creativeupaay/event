import { Router } from "express";
import userRouter from "./user/index";
import organizationRoutes from "./organization/index";
import authRoutes from "./authRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRouter);
router.use("/organization", organizationRoutes);

export default router;
