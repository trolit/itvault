export type ApiError<B = void, Q = void, P = void> = {
  body: B;

  query: Q;

  params: P;
};
