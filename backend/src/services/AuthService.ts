import jwt, { JwtPayload } from "jsonwebtoken";
import { Response } from "express";
import { inject, injectable } from "tsyringe";
import type { SignOptions, VerifyErrors } from "jsonwebtoken";

import {
  JWT_SECRET_KEY,
  JWT_TOKEN_COOKIE_KEY,
  JWT_TOKEN_LIFETIME_IN_SECONDS,
} from "@config";
import { Di } from "@enums/Di";
import {
  DataStoreRole,
  DataStoreUser,
  DataStoreKeyType,
} from "@custom-types/data-store";
import { IAuthService } from "@interfaces/service/IAuthService";
import { IDataStoreService } from "@interfaces/service/IDataStoreService";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(Di.DataStoreService)
    private _dataStoreService: IDataStoreService
  ) {}

  signIn(payload: JwtPayload, options: SignOptions = {}) {
    return jwt.sign(payload, JWT_SECRET_KEY, {
      ...options,
      expiresIn: JWT_TOKEN_LIFETIME_IN_SECONDS,
    });
  }

  async signOut(token: string, response: Response): Promise<number> {
    const decodedToken = <JwtPayload>jwt.decode(token);

    if (!decodedToken.id) {
      return -1;
    }

    const result = await this._dataStoreService.delete([
      decodedToken.id,
      DataStoreKeyType.AuthenticatedUser,
    ]);

    if (result) {
      response.clearCookie(JWT_TOKEN_COOKIE_KEY);

      return result;
    }

    return -1;
  }

  verifyToken(token: string) {
    let verificationError: VerifyErrors | null = null;
    let payload: JwtPayload = { id: -1, email: "" };

    jwt.verify(
      token,
      JWT_SECRET_KEY,
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

  async getSignedUserRole(userId: number): Promise<DataStoreRole | null> {
    const roleId = await this._dataStoreService.getHashField<DataStoreUser>(
      [userId, DataStoreKeyType.AuthenticatedUser],
      "roleId"
    );

    if (!roleId) {
      return null;
    }

    const role = await this._dataStoreService.get<DataStoreRole>([
      roleId,
      DataStoreKeyType.Role,
    ]);

    if (!role) {
      return null;
    }

    return role;
  }
}
