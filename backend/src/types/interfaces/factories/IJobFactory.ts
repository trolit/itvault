import { BaseJob } from "@jobs/BaseJob";
import { Type } from "miscellaneous-types";

export interface IJobFactory {
  create<T extends BaseJob>(Job: Type<T>): BaseJob;
}
