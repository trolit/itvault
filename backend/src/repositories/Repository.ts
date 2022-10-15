import { IRepository } from "@interfaces/IRepository";

export class Repository<T> implements IRepository<T> {
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
