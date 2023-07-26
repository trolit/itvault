import { injectable } from "tsyringe";

import { BaseJob } from "./BaseJob";

import { JobConfig } from "miscellaneous-types";

@injectable()
export class ClearTemporaryUploadsDirectoryJob extends BaseJob {
  jobName = ClearTemporaryUploadsDirectoryJob.name;

  config: JobConfig = {
    time: "59 23 * * *",
    runners: { onTick: this.onTick.bind(this) },
    options: {
      runOnInit: true,
      timeZone: "Europe/Warsaw",
    },
  };

  constructor() {
    super();
  }

  onTick() {
    console.log("aha");
  }
}
