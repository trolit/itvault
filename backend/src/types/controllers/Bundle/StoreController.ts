import { WorkspaceId } from "miscellaneous-types";
import { BundleExpire } from "@enums/BundleExpire";
import { BundleMapDto } from "@mappers/BundleMapDto";
import { AddBundleDto } from "@shared/types/dtos/AddBundleDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = {
      note?: string;

      values: AddBundleDto[];

      expiration: BundleExpire;
    };

    export type Query = WorkspaceId;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<BundleMapDto>;
  }
}
