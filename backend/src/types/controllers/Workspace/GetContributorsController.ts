import { IContributorDTO } from "@shared/types/DTOs/User";

export namespace GetContributorsControllerTypes {
  export namespace v1 {
    export type Params = { id: number };

    export type Request = CustomRequest<Params>;

    export type Response = CustomResponse<IContributorDTO[]>;
  }
}
