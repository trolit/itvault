import "reflect-metadata";
import "module-alias/register";
import { APP } from "./config";
import { server } from "./server";

const startServer = async () => {
  const app = await server();

  const { PORT } = APP;

  app.listen(PORT, () => {
    console.log(`⚡️ Server is running at http://localhost:${PORT}`);
  });
};

startServer();
