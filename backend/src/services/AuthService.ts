import { Response } from "express";
import { DataStore } from "types/DataStore";
import { inject, injectable } from "tsyringe";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IAuthService } from "types/services/IAuthService";
import type { SignOptions, VerifyErrors } from "jsonwebtoken";
import { IDataStoreService } from "types/services/IDataStoreService";

import { JWT } from "@config";

import { Di } from "@enums/Di";
import { Service } from "@enums/Service";

import { composeDataStoreKey } from "@helpers/composeDataStoreKey";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(Di.DataStoreService)
    private _dataStoreService: IDataStoreService
  ) {}

  signIn(payload: JwtPayload, options: SignOptions = {}) {
    return jwt.sign(payload, JWT.SECRET_KEY, {
      ...options,
      expiresIn: JWT.TOKEN_LIFETIME_IN_SECONDS,
    });
  }

  async signOut(token: string, response: Response): Promise<number> {
    const decodedToken = <JwtPayload>jwt.decode(token);

    if (!decodedToken.id) {
      return -1;
    }

    const result = await this._dataStoreService.delete([
      decodedToken.id,
      DataStore.KeyType.AuthenticatedUser,
    ]);

    if (result) {
      response.clearCookie(JWT.COOKIE_KEY);

      return result;
    }

    return -1;
  }

  verifyToken(token: string) {
    let verificationError: VerifyErrors | null = null;
    let payload: JwtPayload = { id: -1, email: "", sessionId: "" };

    jwt.verify(
      token,
      JWT.SECRET_KEY,
      {
        algorithms: ["HS256"],
      },
      (error: VerifyErrors | null, decodedContent: unknown) => {
        if (!error) {
          payload = <JwtPayload>decodedContent;
        } else {
          verificationError = error;
        }
      }
    );

    if (verificationError) {
      return {
        error: verificationError,
      };
    }

    return {
      payload,
    };
  }

  async getRoleFromDataStore(roleId: number): Promise<DataStore.Role | null> {
    try {
      return this._dataStoreService.get<DataStore.Role>([
        roleId,
        DataStore.KeyType.Role,
      ]);
    } catch (error) {
      log.error({
        error,
        message: `Failed to read role #${roleId}: ${error}`,
        service: Service.Redis,
      });

      return null;
    }
  }

  async isSessionActive(userId: number, sessionId: string): Promise<boolean> {
    const key: DataStore.Key = [
      `${userId}-${sessionId}`,
      DataStore.KeyType.AuthenticatedUser,
    ];

    try {
      const keys = await this._dataStoreService.isKeyDefined(key);

      return keys === 1;
    } catch (error) {
      log.error({
        error,
        message: `Failed to find session '${key}'`,
        service: Service.Redis,
      });

      return false;
    }
  }

  async getSessionKeys(userId: number): Promise<string[] | null> {
    const prefix = composeDataStoreKey([
      userId,
      DataStore.KeyType.AuthenticatedUser,
    ]);

    try {
      const [, keys] = await this._dataStoreService.scan(`${prefix}-*`);

      return keys;
    } catch (error) {
      log.error({
        error,
        message: `Failed to get session keys of user #${userId}`,
        service: Service.Redis,
      });

      return null;
    }
  }

  async getSessions(keys: string[]): Promise<DataStore.User[] | null> {
    try {
      const hashes = await this._dataStoreService.getAllHashes(keys);

      if (!hashes) {
        return [];
      }

      const hashesLength = hashes.length;
      const result: DataStore.User[] = [];

      for (let index = 0; index < hashesLength; index++) {
        const [error, hash] = hashes[index];

        if (error) {
          log.error({
            error,
            message: `An error occurred while requesting hash of key '${keys[index]}'`,
            service: Service.Redis,
          });

          continue;
        }

        result.push(<DataStore.User>hash);
      }

      return result;
    } catch (error) {
      log.debug({
        message: `Failed to get session keys: ${keys.join(", ")}`,
        service: Service.Redis,
      });

      return null;
    }
  }
}
