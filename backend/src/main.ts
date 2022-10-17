import "module-alias/register";

import { server } from "./server";
import { APP_PORT } from "./config";

const startServer = async () => {
  const app = await server();

  app.listen(APP_PORT, () => {
    console.log(
      `⚡️[server]: Server is running at https://localhost:${APP_PORT}`
    );
  });
};

startServer();
