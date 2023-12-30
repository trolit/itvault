import { IUpdateUserDTO } from "@shared/types/dtos/User";

export namespace UpdateManyControllerTypes {
  export namespace v1 {
    export type Body = {
      values: IUpdateUserDTO[];
    };

    export type Request = CustomRequest<void, Body>;

    export type Response = CustomResponse<string>;
  }
}
