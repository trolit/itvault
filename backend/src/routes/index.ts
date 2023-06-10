import { Router } from "express";

import authRoutes from "./auth";
import rolesRoute from "./roles";
import userRoutes from "./user";
import workspaceRoutes from "./workspace";

const router = Router();

router.use("/auth", authRoutes);

router.use("/roles", rolesRoute);

router.use("/users", userRoutes);

router.use("/workspaces", workspaceRoutes);

export = router;
