import { AddBundleDto } from "@dtos/AddBundleDto";
import { BundleMapDto } from "@dtos/BundleMapDto";
import { BundleExpire } from "@enums/BundleExpire";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = {
      note?: string;

      values: AddBundleDto[];

      expiration: BundleExpire;
    };

    export type Query = {
      workspaceId: number;
    };

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<BundleMapDto>;
  }
}
