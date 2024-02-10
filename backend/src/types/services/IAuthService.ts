import { Response } from "express";
import { DataStore } from "types/DataStore";
import { JwtPayload, SignOptions, VerifyTokenResult } from "jsonwebtoken";

export interface IAuthService {
  signIn(payload: JwtPayload, options?: SignOptions): string;

  signOut(token: string, response: Response): Promise<number>;

  verifyToken(token: string): VerifyTokenResult;

  getRoleFromDataStore(roleId: number): Promise<DataStore.Role | null>;

  deleteSession(userId: number, sessionId: string): Promise<void>;

  isSessionActive(userId: number, sessionId: string): Promise<boolean>;

  getSessionKeys(userId: number): Promise<string[] | null>;

  getSessions(
    requesterSessionId: string,
    keys: string[]
  ): Promise<DataStore.User[] | null>;
}
