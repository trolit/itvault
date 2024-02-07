import "reflect-metadata";

import { APP } from "./config";
import { server } from "./server";

import { Warden } from "@utils/Warden";

const startServer = async () => {
  Warden.start();

  const app = await server();

  const { PORT } = APP;

  app.listen(PORT, () => {
    log.info({
      message: `⚡️ Server is running at http://localhost:${PORT}`,
    });
  });
};

startServer();
