import { Response } from "express";
import { inject, injectable } from "tsyringe";
import jwt, { JwtPayload } from "jsonwebtoken";
import type { SignOptions, VerifyErrors } from "jsonwebtoken";

import { JWT } from "@config";
import { DataStoreRole, DataStoreUser, DataStoreKeyType } from "@dataStore";

import { Di } from "@enums/Di";
import { IAuthService } from "@interfaces/services/IAuthService";
import { IDataStoreService } from "@interfaces/services/IDataStoreService";

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
      DataStoreKeyType.AuthenticatedUser,
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
