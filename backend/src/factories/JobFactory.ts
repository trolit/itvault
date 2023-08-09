import { CronJob } from "cron";
import { BaseJob } from "@jobs/BaseJob";
import { IJobFactory } from "types/factories/IJobFactory";

import { Type } from "miscellaneous-types";

export class JobFactory implements IJobFactory {
  create<T extends BaseJob>(Job: Type<T>): BaseJob {
    const jobInstance = new Job();

    const { config: jobConfig } = jobInstance;

    const { time, runners, options } = jobConfig;
    const { onTick, onComplete } = runners;
    const { timeZone = "Europe/Warsaw", runOnInit } = options || {};

    const startNow = false;

    jobInstance.instance = new CronJob(
      time,
      onTick,
      onComplete,
      startNow,
      timeZone,
      undefined,
      runOnInit
    );

    return jobInstance;
  }
}
