export type UserSendMessage<T = void> = {
  type: string;

  data?: T;
};
