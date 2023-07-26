import { CronCommand, CronJob } from "cron";

import { IJobFactory } from "@interfaces/factories/IJobFactory";

export class JobFactory implements IJobFactory {
  create(
    time: string,
    runners: { onTick: CronCommand; onComplete?: CronCommand },
    options: {
      startNow?: boolean;
      timeZone?: string;
      runOnInit?: boolean;
    } = {}
  ): CronJob {
    const { onTick, onComplete } = runners;
    const { startNow, timeZone, runOnInit } = options;

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
