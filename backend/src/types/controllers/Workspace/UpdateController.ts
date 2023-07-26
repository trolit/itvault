import { AddEditWorkspaceDto } from "@dtos/AddEditWorkspaceDto";

export namespace UpdateControllerTypes {
  export namespace v1 {
    type Params = {
      id: number;
    };

    export type Request = CustomRequest<Params, AddEditWorkspaceDto>;

    export type Response = CustomResponse<string>;
  }
}
