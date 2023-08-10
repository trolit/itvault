import { WorkspaceMapper } from "@mappers/WorkspaceMapper";

export namespace GetBySlugControllerTypes {
  export namespace v1 {
    export type Params = { slug: string };

    export type Request = CustomRequest<Params, undefined, {}>;

    export type Response = CustomResponse<WorkspaceMapper>;
  }
}
