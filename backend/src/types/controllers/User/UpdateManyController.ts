import { UpdateUserDto } from "@dtos/UpdateUserDto";

export namespace UpdateManyControllerTypes {
  export namespace v1 {
    type Body = {
      value: UpdateUserDto[];
    };

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<UpdateUserDto[] | string>;
  }
}
