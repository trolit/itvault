import { APP } from "@config";

import { IMailViewBuilder } from "@interfaces/IMailViewBuilder";
import { RegistrationMailViewBuilder as VB } from "mail-view-builders-types";

import { buildUrl } from "@helpers/buildURL";

export class RegistrationMailViewBuilder
  implements IMailViewBuilder<VB.Input, VB.Output>
{
  build(data: VB.Input) {
    const { userId, email, code } = data;

    const url = buildUrl(APP.URL, ["auth", "register"], {
      email,
      id: userId,
    });

    return {
      email,
      code,
      href: url.href,
    };
  }
}
