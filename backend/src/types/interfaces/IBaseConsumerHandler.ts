export interface IBaseConsumerHandler<T> {
  handle(data: T): Promise<boolean>;

  onError(data: T): Promise<void>;
}
