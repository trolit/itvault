import { User } from "@db/entities/User";

import { BaseMapper } from "./BaseMapper";

import { IContributorDTO } from "@shared/types/DTOs/User";

export class ContributorMapper
  extends BaseMapper<User>
  implements IContributorDTO
{
  id: number;
  email: string;
  fullName: string;

  constructor(data: User) {
    super(data, ["id", "email", "fullName"]);

    this.assignInitialKeys();
  }
}
