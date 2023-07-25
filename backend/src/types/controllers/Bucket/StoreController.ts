import { BucketDto } from "@dtos/BucketDto";
import { BucketMapDto } from "@dtos/BucketMapDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = {
      values: BucketDto[];

      variantId: string;
    };

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<BucketMapDto[] | string>;
  }
}
