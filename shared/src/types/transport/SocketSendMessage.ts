export type SocketSendMessage<T = void> = {
  type: string;

  data?: T;
};
