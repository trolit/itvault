import { BucketMapper } from "@mappers/BucketMapper";
import { WorkspaceId } from "types/controllers/WorkspaceId";

export namespace GetBucketControllerTypes {
  export namespace v1 {
    export type Params = { id: string };

    export type Query = WorkspaceId & { blueprintId: number };

    export type Request = CustomRequest<Params, undefined, Query>;

    export type Response = CustomResponse<BucketMapper>;
  }
}
