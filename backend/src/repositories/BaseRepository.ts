import { IBaseRepository } from "@interfaces/IBaseRepository";

export class BaseRepository<T> implements IBaseRepository<T> {
  getAll(): Promise<T[]> {
    throw new Error("Method not implemented.");
  }

  getById(id: number): Promise<T> {
    throw new Error("Method not implemented.");
  }

  create(item: T): Promise<T> {
    throw new Error("Method not implemented.");
  }

  update(item: T): Promise<T> {
    throw new Error("Method not implemented.");
  }

  delete(id: number): Promise<T> {
    throw new Error("Method not implemented.");
  }
}
