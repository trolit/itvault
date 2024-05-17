import { Response } from "express";
import { DataStore } from "types/DataStore";
import { inject, injectable } from "tsyringe";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IAuthService } from "types/services/IAuthService";
import type { SignOptions, VerifyErrors } from "jsonwebtoken";
import { IDataStoreService } from "types/services/IDataStoreService";

import { JWT } from "@config";

import { Di } from "@enums/Di";
import { Dependency } from "@enums/Dependency";
import { IUserSessionDTO } from "@shared/types/DTOs/Auth";

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

    const { id: userId, sessionId } = decodedToken;

    const result = await this._dataStoreService.delete([
      `${userId}-${sessionId}`,
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
    let result: DataStore.Role | null = null;

    try {
       result = await this._dataStoreService.get<DataStore.Role>([
        roleId,
        DataStore.KeyType.Role,
      ]);
    } catch (error) {
      log.error({
        error,
        message: `Failed to read role #${roleId}: ${error}`,
        dependency: Dependency.Redis,
      });
    }

    return result;
  }

  async deleteSession(userId: number, sessionId: string): Promise<void> {
    const key: DataStore.Key = [
      `${userId}-${sessionId}`,
      DataStore.KeyType.AuthenticatedUser,
    ];

    try {
      await this._dataStoreService.delete(key);
    } catch (error) {
      log.error({
        error,
        message: `Failed to delete session identified by '${composeDataStoreKey(
          key
        )}'`,
        dependency: Dependency.Redis,
      });
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
        dependency: Dependency.Redis,
      });

      return false;
    }
  }

  async getSessionKeys(userId: number): Promise<string[]> {
    const prefix = composeDataStoreKey([
      userId,
      DataStore.KeyType.AuthenticatedUser,
    ]);

    let result: string[] = [];

    try {
      const [, keys] = await this._dataStoreService.scan(`${prefix}-*`);

      result = keys;
    } catch (error) {
      log.error({
        error,
        message: `Failed to get session keys of user #${userId}`,
        dependency: Dependency.Redis,
      });
    }

    return result;
  }

  async getSessions(
    requesterSessionId: string,
    keys: string[]
  ): Promise<IUserSessionDTO[]> {
    const result: IUserSessionDTO[] = [];

    try {
      const hashes = await this._dataStoreService.getAllHashes(keys);

      if (!hashes) {
        return [];
      }

      const hashesLength = hashes.length;

      for (let index = 0; index < hashesLength; index++) {
        const [error, hash] = hashes[index];

        if (error) {
          log.error({
            error,
            message: `An error occurred while requesting hash of key '${keys[index]}'`,
            dependency: Dependency.Redis,
          });

          continue;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { userId, ...data } = <DataStore.User>hash;

        result.push({
          ...data,
          isRequesterSession: keys[index].includes(requesterSessionId),
        });
      }
    } catch (error) {
      log.error({
        error,
        message: `Failed to get session keys: ${keys.join(", ")}`,
        dependency: Dependency.Redis,
      });
    }

    return result;
  }
}
