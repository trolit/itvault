import { Response } from "supertest";
import { RouterInformation } from "./RouterInformation";
import { RequestInformation } from "./RequestInformation";

export interface IRequestAgent {
  getToken(
    arg: {
      routerVersion: number;
      requestVersion: number;
      user: { email: string; password: string };
    },
    options?: { keep: boolean }
  ): Promise<string>;

  sendRequest<Q extends { version: number }, B = void>(arg: {
    router: RouterInformation;
    request: RequestInformation<Q, B>;
  }): Promise<Response>;

  getRequestUrl(arg: { action: string; router: RouterInformation }): string;
}
