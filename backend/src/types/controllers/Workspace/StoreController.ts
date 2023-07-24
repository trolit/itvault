import { Workspace } from "@entities/Workspace";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = {
      name: string;

      tags: string[];
    };

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<Workspace | string>;
  }
}
