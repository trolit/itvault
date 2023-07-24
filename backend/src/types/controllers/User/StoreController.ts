import { AddEditUserDto } from "@dtos/AddEditUserDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Request = CustomRequest<undefined, AddEditUserDto>;
  }
}
