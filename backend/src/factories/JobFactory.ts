import { CronJob } from "cron";

import { JobConfig } from "miscellaneous-types";
import { IJobFactory } from "@interfaces/factories/IJobFactory";

export class JobFactory implements IJobFactory {
  create(config: JobConfig): CronJob {
    const { time, runners, options } = config;

    const { onTick, onComplete } = runners;
    const { startNow, timeZone, runOnInit } = options || {};

    return new CronJob(
      time,
      onTick,
      onComplete,
      startNow,
      timeZone,
      undefined,
      runOnInit
    );
  }
}
