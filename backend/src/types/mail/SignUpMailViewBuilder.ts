import { User } from "@entities/User";

export namespace SignUpMailViewBuilder {
  export type Input = {
    user: User;
  };

  export type Output = {
    email: string;

    firstName: string;

    lastName: string;

    signUpHref: string;

    appHref: string;
  };
}
