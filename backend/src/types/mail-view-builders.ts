declare module "mail-view-builders-types" {
  import { User } from "@entities/User";

  export namespace RegistrationMailViewBuilder {
    export type Input = {
      user: User;
    };

    export type Output = {
      email: string;

      code: string;

      href: string;
    };
  }
}
