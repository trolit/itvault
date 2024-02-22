import "reflect-metadata";

import { APP } from "./config";
import { server } from "./server";

const startServer = async () => {
  const app = await server();

  const { PORT } = APP;

  app.listen(PORT, () => {
    log.info({
      message: `⚡️ Server is running at http://localhost:${PORT}`,
    });
  });
};

startServer();
