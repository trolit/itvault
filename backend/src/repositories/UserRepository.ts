import { injectable } from "tsyringe";
import { IsNull, Repository } from "typeorm";

import { User } from "@entities/User";
import { dataSource } from "@config/data-source";
import { IUserRepository } from "@interfaces/IUserRepository";

@injectable()
export class UserRepository implements IUserRepository {
  private database: Repository<User>;

  constructor() {
    this.database = dataSource.getRepository(User);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.database.findOneBy({ email, deletedAt: IsNull() });
  }
}
