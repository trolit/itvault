import { DataStore } from "types/DataStore";

export namespace GetSessionsControllerTypes {
  export namespace v1 {
    export type Response = CustomResponse<DataStore.User[]>;
  }
}
