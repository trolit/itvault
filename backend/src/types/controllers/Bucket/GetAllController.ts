import { Bucket } from "@entities/Bucket";

export namespace GetAllControllerTypes {
  export namespace v1 {
    export type Query = {
      variantId: string;
    };

    export type Request = CustomRequest<undefined, undefined, Query>;

    export type Response = CustomResponse<Bucket[]>;
  }
}
