import "module-alias/register";
import "reflect-metadata";

import { server } from "./server";
import { APP_PORT } from "./config";

const startServer = async () => {
  const app = await server();

  app.listen(APP_PORT, () => {
    console.log(`⚡️ Server is running at http://localhost:${APP_PORT}`);
  });
};

startServer();
