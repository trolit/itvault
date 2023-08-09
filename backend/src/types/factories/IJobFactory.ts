import { BaseJob } from "@jobs/BaseJob";
import { ClassType } from "types/ClassType";

export interface IJobFactory {
  create<T extends BaseJob>(Job: ClassType<T>): BaseJob;
}
