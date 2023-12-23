import { WorkspaceId } from "../WorkspaceId";
import { BucketMapper } from "@mappers/BucketMapper";
import { IAddEditBucketDto } from "@shared/types/dtos/Bucket";

export namespace UpsertControllerTypes {
  export namespace v1 {
    export type Query = WorkspaceId;

    export type Body = IAddEditBucketDto;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<BucketMapper | string>;
  }
}
