import { IMailViewBuilder } from "types/mail/IMailViewBuilder";
import { SignUpMailViewBuilder as VB } from "types/mail/SignUpMailViewBuilder";

import { APP } from "@config";

import { buildUrl } from "@helpers/buildUrl";

export class SignUpMailViewBuilder
  implements IMailViewBuilder<VB.Input, VB.Output>
{
  build(data: VB.Input) {
    const {
      user: { id, email, signUpCode, firstName, lastName },
    } = data;

    const url = buildUrl(APP.URL, ["guest", "sign-up"], {
      email,

      id: id.toString(),

      code: signUpCode,
    });

    return {
      email,
      lastName,
      firstName,
      appHref: APP.URL,
      signUpHref: url.href,
    };
  }
}
