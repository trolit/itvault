import { Router } from "express";

import authRouter from "./auth";
import notesRouter from "./notes";
import rolesRouter from "./roles";
import usersRouter from "./users";
import workspacesRouter from "./workspaces";

const router = Router();

router.use("/auth", authRouter);

router.use("/roles", rolesRouter);

router.use("/users", usersRouter);

router.use("/notes", notesRouter);

router.use("/workspaces", workspacesRouter);

export = router;
