import { WorkspaceId } from "types/controllers/WorkspaceId";

import { VariantMapper } from "@mappers/VariantMapper";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = {
      name: string;

      fileId: number;
    };

    type Query = WorkspaceId;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<VariantMapper>;
  }
}
