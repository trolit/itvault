import { WorkspaceId } from "miscellaneous-types";
import { VariantMapper } from "@mappers/VariantMapper";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = {
      name: string;

      fileId: number;

      variantId?: string;
    };

    type Query = WorkspaceId;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<VariantMapper>;
  }
}
