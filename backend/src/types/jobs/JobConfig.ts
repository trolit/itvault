import { CronCommand } from "cron";

export type JobConfig = {
  time: string;
  runners: { onTick: CronCommand; onComplete?: CronCommand };
  options?: {
    timeZone?: string;
    runOnInit?: boolean;
  };
};
