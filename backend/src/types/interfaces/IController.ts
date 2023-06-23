export interface IController<P = void, B = void, Q = void, R = void> {
  invoke(
    request: CustomRequest<P, B, Q>,
    response: CustomResponse<R>
  ): Promise<CustomResponse<R>>;
}
