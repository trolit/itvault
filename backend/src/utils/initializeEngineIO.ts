import { Server } from "engine.io";

import { APP } from "@config";

export const initializeEngineIO = () => {
  return new Server({
    cors: {
      origin: APP.URL,
      credentials: true,
    },

    allowRequest: (request, callback) => {
      return callback(null, true);
    },
  });
};
