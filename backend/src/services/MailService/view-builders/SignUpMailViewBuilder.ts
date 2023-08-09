import { IMailViewBuilder } from "types/mail/IMailViewBuilder";
import { SignUpMailViewBuilder as VB } from "types/mail/SignUpMailViewBuilder";

import { APP } from "@config";

import { buildUrl } from "@helpers/buildUrl";

export class SignUpMailViewBuilder
  implements IMailViewBuilder<VB.Input, VB.Output>
{
  build(data: VB.Input) {
    const {
      user: { id, email, signUpCode },
    } = data;

    const url = buildUrl(APP.URL, ["auth", "register"], {
      email,

      id: id.toString(),

      code: signUpCode,
    });

    return {
      email,
      href: url.href,
    };
  }
}
