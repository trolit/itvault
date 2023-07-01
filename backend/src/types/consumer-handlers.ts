declare module "consumer-handlers-types" {
  import { Bundle } from "@entities/Bundle";
  import { IBody } from "@controllers/Bundle/StoreController";

  export type BundleConsumerHandlerData = {
    workspaceId: number;
    body: IBody;
    bundle: Bundle;
  };
}
