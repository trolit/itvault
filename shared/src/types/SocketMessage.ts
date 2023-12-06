export type SocketMessage<T = void> = {
  type: string;

  value: T;
};
