import { Router } from "express";

import authRouter from "./auth";
import notesRouter from "./notes";
import rolesRouter from "./roles";
import usersRouter from "./users";
import workspacesRouter from "./workspaces";

const v1Router = Router();

v1Router.use("/auth", authRouter);

v1Router.use("/roles", rolesRouter);

v1Router.use("/users", usersRouter);

v1Router.use("/notes", notesRouter);

v1Router.use("/workspaces", workspacesRouter);

export = v1Router;
