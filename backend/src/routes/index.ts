import { Router } from "express";

import authRoutes from "./auth";
import roleRoutes from "./role";
import userRoutes from "./user";
import workspaceRoutes from "./workspace";

const router = Router();

router.use("/auth", authRoutes);

router.use("/roles", roleRoutes);

router.use("/users", userRoutes);

router.use("/workspaces", workspaceRoutes);

export = router;
