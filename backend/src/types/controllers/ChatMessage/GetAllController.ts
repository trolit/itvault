import { IPaginationOptions } from "types/IPaginationOptions";
import { ChatMessageMapper } from "@mappers/ChatMessageMapper";
import { IPaginationQuery } from "@shared/types/IPaginationQuery";
import { PaginatedResponse } from "@shared/types/PaginatedResponse";

export namespace GetAllControllerTypes {
  export namespace v1 {
    type QueryCommon = { messageId?: number };

    export type QueryInput = QueryCommon & IPaginationQuery;

    export type QueryOutput = QueryCommon & IPaginationOptions;

    export type Request = CustomRequest<undefined, undefined, QueryOutput>;

    export type Response = CustomResponse<PaginatedResponse<ChatMessageMapper>>;
  }
}
