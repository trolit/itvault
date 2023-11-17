import { PinControllerTypes } from "./PinController";

export namespace UnpinControllerTypes {
  export namespace v1 {
    export type Params = PinControllerTypes.v1.Params;

    export type EntityFields = PinControllerTypes.v1.EntityFields;

    export type Request = CustomRequest<Params>;

    export type Response = CustomResponse<void>;
  }
}
