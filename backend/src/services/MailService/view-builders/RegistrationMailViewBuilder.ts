import { IMailViewBuilder } from "@interfaces/IMailViewBuilder";

export class SignUpMailViewBuilder
  implements IMailViewBuilder<{ email: string }>
{
  build(data: { email: string }) {
    return data;
  }
}
