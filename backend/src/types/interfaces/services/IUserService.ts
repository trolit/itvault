import { UpdateUserDto } from "@dtos/UpdateUserDto";

export interface IUserService {
  reflectChangesInDataStore(entitiesToUpdate: UpdateUserDto[]): Promise<void>;

  updateMany(data: UpdateUserDto[]): Promise<string | null>;
}
