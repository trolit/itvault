export interface IMailRenderer<T> {
  render(data: T): string;
}
