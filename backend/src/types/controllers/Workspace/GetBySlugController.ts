import { WorkspaceId } from "../WorkspaceId";
import { WorkspaceMapper } from "@mappers/WorkspaceMapper";

export namespace GetBySlugControllerTypes {
  export namespace v1 {
    export type Query = WorkspaceId & { slug: string };

    export type Request = CustomRequest<undefined, undefined, Query>;

    export type Response = CustomResponse<WorkspaceMapper>;
  }
}
