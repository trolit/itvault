import { BucketMapDto } from "@dtos/mappers/BucketMapDto";
import { AddBucketDto } from "@shared/types/dtos/AddBucketDto";

export namespace StoreManyControllerTypes {
  export namespace v1 {
    export type Body = {
      values: AddBucketDto[];

      variantId: string;
    };

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<BucketMapDto[] | string>;
  }
}
