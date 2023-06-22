import { UpdateUserDto } from "@dtos/UpdateUserDto";

export interface IUserService {
  reflectUpdateManyInDataStore(
    entitiesToUpdate: UpdateUserDto[]
  ): Promise<void>;
}
