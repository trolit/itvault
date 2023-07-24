import { AddEditRoleDto } from "@dtos/AddEditRoleDto";

export namespace UpdateControllerTypes {
  export namespace v1 {
    type Params = {
      id: number;
    };

    export type Request = CustomRequest<Params, AddEditRoleDto>;

    export type Response = CustomResponse<string>;
  }
}
