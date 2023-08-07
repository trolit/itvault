import { TagMapDto } from "@mappers/TagMapDto";
import { PaginatedResponse } from "miscellaneous-types";

export namespace GetAllControllerTypes {
  export namespace v1 {
    export type Query = {
      search?: string;
    };

    export type Request = CustomRequest<undefined, undefined, Query>;

    export type Response = CustomResponse<PaginatedResponse<TagMapDto>>;
  }
}
