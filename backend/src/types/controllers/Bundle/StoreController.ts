import { WorkspaceId } from "types/controllers/WorkspaceId";

import { BundleMapper } from "@mappers/BundleMapper";
import { AddBundleDto } from "@shared/types/dtos/AddBundleDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = AddBundleDto;

    export type Query = WorkspaceId;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<BundleMapper>;
  }
}
