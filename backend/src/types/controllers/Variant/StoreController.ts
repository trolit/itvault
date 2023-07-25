import { VariantMapDto } from "@dtos/VariantMapDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = {
      name: string;

      fileId: number;

      variantId?: string;
    };

    type Query = {
      workspaceId: number;
    };

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<VariantMapDto>;
  }
}
