import { IMailViewBuilder } from "@interfaces/IMailViewBuilder";

export interface IData {
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
    const { email, code } = data;

    // @TODO generate code

    return {
      email,
      code,
      href: "",
    };
  }
}
