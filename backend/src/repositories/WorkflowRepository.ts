import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { Workflow } from "@entities/Workflow";

@injectable()
export class WorkflowRepository extends Repository<Workflow> {}
