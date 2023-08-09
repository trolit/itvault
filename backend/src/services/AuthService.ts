import { Response } from "express";
import { DataStore } from "types/DataStore";
import { inject, injectable } from "tsyringe";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IAuthService } from "types/services/IAuthService";
import type { SignOptions, VerifyErrors } from "jsonwebtoken";
import { IDataStoreService } from "types/services/IDataStoreService";

import { JWT } from "@config";

import { Di } from "@enums/Di";

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
    let payload: JwtPayload = { id: -1, email: "" };

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

  async getSignedUserRole(userId: number): Promise<DataStore.Role | null> {
    const roleId = await this._dataStoreService.getHashField<DataStore.User>(
      [userId, DataStore.KeyType.AuthenticatedUser],
      "roleId"
    );

    if (!roleId) {
      return null;
    }

    const role = await this._dataStoreService.get<DataStore.Role>([
      roleId,
      DataStore.KeyType.Role,
    ]);

    if (!role) {
      return null;
    }

    return role;
  }
}
