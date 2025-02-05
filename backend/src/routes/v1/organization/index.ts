import { Router } from "express";
import eventRoutes from "./eventRoutes"
import organizationRoutes from "./organizationRoutes"

const router = Router();

router.use("/event", eventRoutes);
router.use("/org", organizationRoutes);

export default router;
