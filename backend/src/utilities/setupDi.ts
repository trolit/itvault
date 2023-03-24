import { container } from "tsyringe";

import { UserRepository } from "@repositories/UserRepository";
import { AuthService } from "@services/AuthService";

export const setupDi = () => {
  container.register("IUserRepository", UserRepository);

  container.register("IAuthService", AuthService);
};
