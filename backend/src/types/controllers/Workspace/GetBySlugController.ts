import { WorkspaceId } from "../WorkspaceId";
import { WorkspaceMapper } from "@mappers/WorkspaceMapper";

export namespace GetBySlugControllerTypes {
  export namespace v1 {
    export type Params = { slug: string };

    export type Query = WorkspaceId;

    export type Request = CustomRequest<Params, undefined, Query>;

    export type Response = CustomResponse<WorkspaceMapper>;
  }
}
