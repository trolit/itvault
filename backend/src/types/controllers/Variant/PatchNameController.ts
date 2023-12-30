import { IPatchNameDTO } from "@shared/types/dtos/shared";
import { WorkspaceId } from "types/controllers/WorkspaceId";

export namespace PatchNameControllerTypes {
  export namespace v1 {
    export type Params = {
      id: string;
    };

    export type Body = IPatchNameDTO;

    export type Query = { fileId: number } & WorkspaceId;

    export type Request = CustomRequest<Params, Body, Query>;
  }
}
