import { CustomRequest, CustomResponse } from "@utilities/types";

export interface IController<B = void, Q = void, R = void> {
  invoke(
    request: CustomRequest<B, Q>,
    response: CustomResponse<R>
  ): Promise<CustomResponse<R>>;
}
