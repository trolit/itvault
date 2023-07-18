import { APP } from "@config";

import { IMailViewBuilder } from "@interfaces/IMailViewBuilder";

import { buildUrl } from "@helpers/buildURL";

export interface IData {
  userId: number;

  email: string;

  code: string;
}

export interface IResult {
  email: string;

  code: string;

  href: string;
}

export class RegistrationMailViewBuilder
  implements IMailViewBuilder<IData, IResult>
{
  build(data: IData) {
    const { userId, email, code } = data;

    const url = buildUrl(APP.URL, ["auth", "sign-up"], {
      email,
      userId: userId.toString(),
    });

    return {
      email,
      code,
      href: url.href,
    };
  }
}
