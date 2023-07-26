import { CronCommand, CronJob } from "cron";

export interface IJobFactory {
  create(
    time: string,
    runners: { onTick: CronCommand; onComplete?: CronCommand },
    options?: {
      startNow?: boolean;
      timeZone?: string;
      runOnInit?: boolean;
    }
  ): CronJob;
}
