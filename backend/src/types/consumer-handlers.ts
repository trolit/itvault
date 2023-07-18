declare module "consumer-handlers-types" {
  import { Bundle } from "@entities/Bundle";

  export type BundleConsumerHandlerData = {
    bundle: Bundle;

    workspaceId: number;
  };

  export type MailConsumerHandlerData<T> = {
    email: string;

    subject: string;

    viewBuilderName: string;
  } & T;
}
