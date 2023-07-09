import cors from "cors";
import path from "path";
import fs from "fs-extra";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { StatusCodes as HTTP } from "http-status-codes";
import express, { Application, Request, Response, Router } from "express";

import { APP } from "@config";

import { requireAuthentication } from "@middleware/requireAuthentication";

export const setupExpress = async (app: Application) => {
  app.use(
    cors({
      credentials: true,
      origin: APP.URL,
    })
  );

  app.use(express.json());

  app.use(helmet());

  app.use(cookieParser());

  app.use(APP.ROUTES_PREFIX, await getRoutes());

  app.use((error: Error, request: Request, response: Response) => {
    console.error(error.stack);

    response
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .send("Oops.. Something broke 😢");
  });
};

async function getRoutes() {
  const routesDir = path.join("dist", "routes");

  const versions = fs.readdirSync(routesDir);

  const mainRouter = Router();

  for (const version of versions) {
    const versionRouter = Router();

    const routers = fs.readdirSync(path.join(routesDir, version));

    const registeredRouters: string[] = [];

    for (const router of routers) {
      const dependency = await import(
        path.resolve("dist", "routes", version, router)
      );

      const [routeName] = router.split(".");

      if (routeName !== "auth") {
        versionRouter.use(requireAuthentication);
      }

      versionRouter.use(`/${routeName}`, dependency.default);

      registeredRouters.push(routeName);
    }

    console.log(
      `Express: registered ${version} routes (${registeredRouters.join(", ")})`
    );

    mainRouter.use(`/${version}`, versionRouter);
  }

  return mainRouter;
}
