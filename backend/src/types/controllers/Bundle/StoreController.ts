import { WorkspaceId } from "types/controllers/WorkspaceId";

import { BundleMapper } from "@mappers/BundleMapper";
import { AddBundleDto } from "@shared/types/dtos/AddBundleDto";
import { BundleExpire } from "@shared/types/enums/BundleExpire";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = {
      note?: string;

      values: AddBundleDto[];

      expiration: BundleExpire;
    };

    export type Query = WorkspaceId;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<BundleMapper>;
  }
}
