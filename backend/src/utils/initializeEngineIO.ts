import { Server } from "engine.io";

import { APP } from "@config";

export const initializeEngineIO = () => {
  return new Server({
    cors: {
      origin: APP.URL,
    },

    allowRequest: (request, callback) => {
      return callback(null, true);
    },
  });
};
