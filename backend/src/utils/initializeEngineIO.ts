import { Server } from "engine.io";
import { IAuthService } from "types/services/IAuthService";
import { IncomingAllowRequestMessage } from "types/IncomingAllowRequestMessage";

import { APP } from "@config";

import { Di } from "@enums/Di";
import { Dependency } from "@enums/Dependency";

import { getInstanceOf } from "@helpers/getInstanceOf";
import { getTokenCookieValue } from "@helpers/getTokenCookieValue";

export const initializeEngineIO = () => {
  log.debug({
    dependency: Dependency.EngineIO,
    message: `Initializing server..`,
  });

  return new Server({
    cors: {
      origin: APP.URL,
      credentials: true,
    },

    // @NOTE handshake (only) on valid token
    allowRequest: async (request: IncomingAllowRequestMessage, callback) => {
      const cookie = request.headers.cookie;

      if (!cookie) {
        return callback("Missing credentials!", false);
      }

      const token = getTokenCookieValue(cookie);

      if (!token) {
        return callback(null, false);
      }

      const authService = getInstanceOf<IAuthService>(Di.AuthService);

      const result = authService.verifyToken(token);

      if (result.error) {
        return callback(null, false);
      }

      const userId = result.payload.id;

      request.userId = userId;

      return callback(null, true);
    },
  });
};
