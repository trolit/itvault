import { BucketDto } from "@dtos/BucketDto";
import { Bucket } from "@entities/Bucket";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = {
      values: BucketDto[];

      variantId: string;
    };

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<Bucket[] | string>;
  }
}
