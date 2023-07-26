import { CronJob } from "cron";
import { JobConfig } from "miscellaneous-types";

export interface IJobFactory {
  create(config: JobConfig): CronJob;
}
