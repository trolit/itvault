import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { User } from "@entities/User";

@injectable()
export class UserRepository extends Repository<User> {}
