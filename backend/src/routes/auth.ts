import { container } from "tsyringe";
import { Request, Response, Router } from "express";

import { LoginController } from "@controllers/Auth/Login";

const instance = container.resolve(LoginController);

const route = Router();

route.post("/login", (request: Request, response: Response) => {
  instance.invoke(request, response);
});

export default route;
