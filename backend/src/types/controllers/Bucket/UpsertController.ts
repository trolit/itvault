import { WorkspaceId } from "../WorkspaceId";
import { BucketMapper } from "@mappers/BucketMapper";
import { AddBucketDto } from "@shared/types/dtos/AddBucketDto";

export namespace UpsertControllerTypes {
  export namespace v1 {
    export type Query = WorkspaceId;

    export type Body = AddBucketDto & {
      variantId: string;
    };

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<BucketMapper | string>;
  }
}
