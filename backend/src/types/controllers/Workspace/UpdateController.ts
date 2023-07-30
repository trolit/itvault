import { AddEditWorkspaceDto } from "@dtos/AddEditWorkspaceDto";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = AddEditWorkspaceDto;

    export type Request = CustomRequest<Params, AddEditWorkspaceDto>;

    export type Response = CustomResponse<string>;
  }
}
