export type SocketReceiveMessage<T> = {
  action: string;

  data: T;
};
