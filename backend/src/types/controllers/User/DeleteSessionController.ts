export namespace DeleteSessionControllerTypes {
  export namespace v1 {
    export type Params = {
      id: string;

      sessionId: string;
    };

    export type Request = CustomRequest<Params>;
  }
}
