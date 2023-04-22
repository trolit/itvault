import jwt from "jsonwebtoken";
import { Response } from "express";
import { inject, injectable } from "tsyringe";
import type { SignOptions, VerifyErrors } from "jsonwebtoken";

import {
  JWT_SECRET_KEY,
  JWT_TOKEN_COOKIE_KEY,
  JWT_TOKEN_LIFETIME_IN_SECONDS,
} from "@config";
import { Di } from "@enums/Di";
import { JwtPayload } from "@utils/JwtPayload";
import { DataStoreRole } from "@utils/DataStoreRole";
import { DataStoreUser } from "@utils/DataStoreUser";
import { DataStoreKeyType } from "@enums/DataStoreKeyType";
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

    const result = await this._dataStoreService.delete(
      decodedToken.id,
      DataStoreKeyType.AuthenticatedUser
    );

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

  async findLoggedUserData(
    userId: number
  ): Promise<[DataStoreUser, DataStoreRole] | null> {
    const userData = await this._dataStoreService.get<DataStoreUser>(
      userId,
      DataStoreKeyType.AuthenticatedUser
    );

    if (!userData) {
      return null;
    }

    const roleData = await this._dataStoreService.get<DataStoreRole>(
      userData.roleId,
      DataStoreKeyType.Role
    );

    if (!roleData) {
      return null;
    }

    return [userData, roleData];
  }
}
