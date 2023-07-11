declare module "consumer-handlers-types" {
  import { Bundle } from "@entities/Bundle";

  export type BundleConsumerHandlerData = {
    bundle: Bundle;

    workspaceId: number;
  };
}
