import { attach } from "engine.io";
import { Server, IncomingMessage, ServerResponse } from "http";

import { APP } from "@config";

export const initializeEngineIO = (
  server: Server<typeof IncomingMessage, typeof ServerResponse>
) =>
  attach(server, {
    cors: {
      origin: APP.URL,
    },
  });
