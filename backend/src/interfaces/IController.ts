import { CustomRequest, CustomResponse } from "@utilities/types";

export interface IController<Q = void, B = void, R = void> {
  invoke(
    request: CustomRequest<B, Q>,
    response: CustomResponse<R>
  ): Promise<CustomResponse<R>>;
}
