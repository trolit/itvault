import { BucketMapDto } from "@dtos/BucketMapDto";
import { AddBucketDto } from "@dtos/AddBucketDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = {
      values: AddBucketDto[];

      variantId: string;
    };

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<BucketMapDto[] | string>;
  }
}
