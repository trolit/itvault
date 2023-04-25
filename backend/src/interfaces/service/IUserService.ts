import { UpdateUserDto } from "@dtos/UpdateUserDto";

export interface IUserService {
  reflectUpdateManyRequestInDataStore(
    entitiesToUpdate: UpdateUserDto[]
  ): Promise<void>;
}
