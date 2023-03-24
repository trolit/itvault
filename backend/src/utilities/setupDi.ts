import { container } from "tsyringe";

import { AuthService } from "@services/AuthService";
import { UserRepository } from "@repositories/UserRepository";
import { EntityMapperService } from "@services/EntityMapperService";
import { WorkspaceRepository } from "@repositories/WorkspaceRepository";

export const setupDi = () => {
  /* repositories */
  /* ------------ */

  container.register("IUserRepository", UserRepository);

  container.register("IWorkspaceRepository", WorkspaceRepository);

  /* services */
  /* ------------ */

  container.register("IAuthService", AuthService);

  container.register("IEntityMapperService", EntityMapperService);
};
