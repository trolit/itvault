import { BundleDto } from "@dtos/BundleDto";
import { BundleExpire } from "@enums/BundleExpire";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = {
      note?: string;

      values: BundleDto[];

      expiration: BundleExpire;
    };

    export type Query = {
      workspaceId: number;
    };

    export type Request = CustomRequest<undefined, Body, Query>;
  }
}
