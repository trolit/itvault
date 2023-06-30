export interface IBaseConsumerHandler<T> {
  handle(data: T): Promise<void>;
}
