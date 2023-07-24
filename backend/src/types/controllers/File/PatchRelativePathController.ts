export namespace PatchRelativePathControllerTypes {
  export namespace v1 {
    type Params = {
      fileId: number;
    };

    type Body = {
      relativePath: string;
    };

    export type Request = CustomRequest<Params, Body>;
  }
}
