import { Router } from "express";

import { Permission } from "@enums/Permission";
import { paginationSchema } from "@schemas/pagination";
import { processRequestWith } from "./processRequestWith";
import { safeParseRequest } from "@middlewares/safeParseRequest";
import { GetAllController } from "@controllers/User/GetAllController";
import { requireAuthenticationWithOptions } from "@middlewares/requireAuthentication";

const userRoutes = Router();

userRoutes.get(
  "/v1",
  requireAuthenticationWithOptions({
    withActiveAccount: true,
    withPermission: Permission.ViewAllUsers,
  }),
  safeParseRequest({ query: { withSchema: paginationSchema } }),
  processRequestWith(GetAllController)
);

export = userRoutes;
