import { Blueprint } from "@db/entities/Blueprint";
import { Workspace } from "@db/entities/Workspace";

export namespace PinControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type EntityFields = Pick<Workspace, "id" | "pinnedAt"> &
      Pick<Blueprint, "id" | "pinnedAt">;

    export type Request = CustomRequest<Params>;
  }
}
