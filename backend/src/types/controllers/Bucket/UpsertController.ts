import { WorkspaceId } from "../WorkspaceId";
import { BucketMapper } from "@mappers/BucketMapper";
import { IAddEditBucketDTO } from "@shared/types/DTOs/Bucket";

export namespace UpsertControllerTypes {
  export namespace v1 {
    export type Query = WorkspaceId;

    export type Body = IAddEditBucketDTO;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<BucketMapper | string>;
  }
}
