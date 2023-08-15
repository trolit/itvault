import { BlueprintMapper } from "@mappers/BlueprintMapper";
import { WorkspaceId } from "types/controllers/WorkspaceId";

export namespace GetAllBlueprintsControllerTypes {
  export namespace v1 {
    export type Params = { id: string };

    export type Query = WorkspaceId;

    export type Request = CustomRequest<Params, undefined, Query>;

    export type Response = CustomResponse<BlueprintMapper[]>;
  }
}
