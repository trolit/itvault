import { injectable } from "tsyringe";

import { BaseJob } from "./BaseJob";

import { JobConfig } from "miscellaneous-types";

@injectable()
export class ClearTemporaryUploadsDirectoryJob extends BaseJob {
  jobName: string;

  config: JobConfig = {
    time: "",
    runners: { onTick: this.onTick.bind(this) },
    options: {
      startNow: true,
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
