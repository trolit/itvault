export interface ISocketServiceManager {
  initialize(): void;

  sendMessage<T = void>(type: string, data?: T): void;
}
