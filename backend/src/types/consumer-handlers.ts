declare module "consumer-handlers-types" {
  import { Bundle } from "@entities/Bundle";

  export type BundleConsumerHandlerData = {
    bundle: Bundle;

    workspaceId: number;
  };

  export type MailConsumerHandlerData = {
    subject: string;

    viewBuilderName: string;

    email: string;

    code: string;
  };
}
