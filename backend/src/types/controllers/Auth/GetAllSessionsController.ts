import { DataStore } from "types/DataStore";

export namespace GetAllSessionsControllerTypes {
  export namespace v1 {
    export type Response = CustomResponse<DataStore.User[]>;
  }
}
