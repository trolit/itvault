import { CronJob } from "cron";
import { IJob } from "types/jobs/IJob";
import { JobConfig } from "types/jobs/JobConfig";

export abstract class BaseJob implements IJob {
  instance: CronJob | null = null;

  abstract jobName: string;

  abstract config: JobConfig;

  run(): void {
    if (!this.instance) {
      console.log(`CRON: Something wrong with ${this.jobName} job!!`);

      return;
    }

    this.instance.start();

    console.log(`CRON: ${this.jobName} is running.`);
  }

  stop(): void {
    if (!this.instance) {
      console.log(`CRON: Job ${this.jobName} is already stopped!!`);

      return;
    }

    this.instance.stop();

    this.instance = null;

    console.log(`CRON: Stopped ${this.jobName} job.`);
  }

  abstract onTick(): Promise<void> | void;

  async onComplete(callback?: () => void | Promise<void>) {
    if (callback) {
      await callback();
    }

    console.log(`CRON: ${this.jobName} completed.`);
  }
}
