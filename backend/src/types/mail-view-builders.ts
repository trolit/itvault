declare module "mail-view-builders-types" {
  import { User } from "@entities/User";

  export namespace SignUpMailViewBuilder {
    export type Input = {
      user: User;
    };

    export type Output = {
      email: string;

      href: string;
    };
  }
}
