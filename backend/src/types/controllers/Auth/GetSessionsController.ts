import { IUserSessionDTO } from "@shared/types/DTOs/Auth";

export namespace GetSessionsControllerTypes {
  export namespace v1 {
    export type Response = CustomResponse<IUserSessionDTO[]>;
  }
}
