import { BucketMapper } from "@mappers/BucketMapper";
import { AddBucketDto } from "@shared/types/dtos/AddBucketDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = AddBucketDto & {
      variantId: string;
    };

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<BucketMapper | string>;
  }
}
