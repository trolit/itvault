import { WorkspaceId } from "../WorkspaceId";
import { BucketMapper } from "@mappers/BucketMapper";
import { AddEditBucketDto } from "@shared/types/dtos/AddEditBucketDto";

export namespace UpsertControllerTypes {
  export namespace v1 {
    export type Query = WorkspaceId;

    export type Body = AddEditBucketDto;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<BucketMapper | string>;
  }
}
