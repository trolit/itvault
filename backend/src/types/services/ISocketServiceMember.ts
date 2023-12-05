export interface ISocketServiceMember {
  sendMessage<T>(type: string, value?: T): void;
}
