import { Router } from "express";

import { LoginController } from "@controllers/Auth/Login";
import { processRequestWith } from "./processRequestWith";

const authRoutes = Router();

authRoutes.post("/login", processRequestWith(LoginController));

export = authRoutes;
