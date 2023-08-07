import { WorkspaceId } from "miscellaneous-types";
import { VariantMapper } from "@mappers/VariantMapper";

export namespace GetByIdControllerTypes {
  export namespace v1 {
    type Params = {
      variantId: string;
    };

    type Query = WorkspaceId;

    export type Request = CustomRequest<Params, undefined, Query>;

    export type Response = CustomResponse<{
      record: VariantMapper;

      content: string;
    }>;
  }
}
