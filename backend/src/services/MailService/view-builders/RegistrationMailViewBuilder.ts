import { IMailViewBuilder } from "@interfaces/IMailViewBuilder";

export class RegistrationMailViewBuilder
  implements IMailViewBuilder<{ email: string }>
{
  build(data: { email: string }) {
    return data;
  }
}
