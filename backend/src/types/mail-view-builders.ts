declare module "mail-view-builders-types" {
  import { User } from "@entities/User";

  export namespace RegistrationMailViewBuilder {
    export type Input = {
      user: User;

      code: string;
    };

    export type Output = {
      email: string;

      code: string;

      href: string;
    };
  }
}
