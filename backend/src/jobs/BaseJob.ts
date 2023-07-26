import { CronJob } from "cron";

import { Di } from "@enums/Di";
import { IJob } from "@interfaces/IJob";
import { JobConfig } from "miscellaneous-types";
import { IJobFactory } from "@interfaces/factories/IJobFactory";

import { getInstanceOf } from "@helpers/getInstanceOf";

export abstract class BaseJob implements IJob {
  instance: CronJob | null = null;

  abstract jobName: string;

  abstract config: JobConfig;

  run(): void {
    const jobFactory = getInstanceOf<IJobFactory>(Di.JobFactory);

    this.instance = jobFactory.create(this.config);

    console.log(`CRON: Job ${this.jobName} is running!!`);
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
}
