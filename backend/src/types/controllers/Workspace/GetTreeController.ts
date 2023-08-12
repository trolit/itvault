import { FileMapper } from "@mappers/FileMapper";
import { DirectoryMapper } from "@mappers/DirectoryMapper";

export namespace GetTreeControllerTypes {
  export namespace v1 {
    export type Query = {
      blueprintId?: number;

      relativePath?: string;
    };

    export type Params = { id: number };

    export type Request = CustomRequest<Params, undefined, Query>;

    export type Response = CustomResponse<(FileMapper | DirectoryMapper)[]>;
  }
}
