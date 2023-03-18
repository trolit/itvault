import { Router } from "express";

import authRoutes from "./auth";
import workspaceRoutes from "./workspace";

const router = Router();

router.use("/auth", authRoutes);

router.use("/workspaces", workspaceRoutes);

export = router;
