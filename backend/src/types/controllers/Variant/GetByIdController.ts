import { WorkspaceId } from "miscellaneous-types";
import { VariantMapDto } from "@dtos/mappers/VariantMapDto";

export namespace GetByIdControllerTypes {
  export namespace v1 {
    type Params = {
      variantId: string;
    };

    type Query = WorkspaceId;

    export type Request = CustomRequest<Params, undefined, Query>;

    export type Response = CustomResponse<{
      record: VariantMapDto;

      content: string;
    }>;
  }
}
