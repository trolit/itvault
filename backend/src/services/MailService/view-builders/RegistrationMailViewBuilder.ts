import { APP } from "@config";

import { IMailViewBuilder } from "@interfaces/IMailViewBuilder";
import { RegistrationMailViewBuilder as VB } from "mail-view-builders-types";

import { buildUrl } from "@helpers/buildUrl";

export class RegistrationMailViewBuilder
  implements IMailViewBuilder<VB.Input, VB.Output>
{
  build(data: VB.Input) {
    const {
      user: { id, email, registrationCode },
    } = data;

    const url = buildUrl(APP.URL, ["auth", "register"], {
      email,
      id: id.toString(),
    });

    return {
      email,
      href: url.href,
      code: registrationCode,
    };
  }
}
