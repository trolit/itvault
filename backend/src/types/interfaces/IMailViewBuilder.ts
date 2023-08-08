export interface IMailViewBuilder<T, Y = T> {
  build(data: T): Y;
}
