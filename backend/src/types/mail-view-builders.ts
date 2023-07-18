declare module "mail-view-builders-types" {
  export namespace RegistrationMailViewBuilder {
    export type Input = {
      userId: string;

      email: string;

      code: string;
    };

    export type Output = {
      email: string;

      code: string;

      href: string;
    };
  }
}
