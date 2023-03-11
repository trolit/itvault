import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { Workspace } from "@entities/Workspace";

@injectable()
export class WorkspaceRepository extends Repository<Workspace> {}
