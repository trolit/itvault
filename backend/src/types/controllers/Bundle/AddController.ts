import { WorkspaceId } from "types/controllers/WorkspaceId";

import { BundleMapper } from "@mappers/BundleMapper";
import { IAddBundleDTO } from "@shared/types/DTOs/Bundle";

export namespace AddControllerTypes {
  export namespace v1 {
    export type Body = IAddBundleDTO;

    export type Query = WorkspaceId;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<BundleMapper>;
  }
}
