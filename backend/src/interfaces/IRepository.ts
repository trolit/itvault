export interface IRepository<T> {
  getAll(): Promise<T[]>;

  getById(id: number): Promise<T>;

  create(item: T): Promise<T>;

  update(item: T): Promise<T>;

  delete(id: number): Promise<T>;
}
