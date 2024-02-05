import { CronCommand } from "cron";

export type JobConfig = {
  time: string;
  // @NOTE onComplete — A function that will fire when the job is complete, when it is >> stopped <<
  runners: { onTick: CronCommand; onComplete?: CronCommand };
  options?: {
    timeZone?: string;
    runOnInit?: boolean;
  };
};
