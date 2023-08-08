import { injectable } from "tsyringe";
import { JobConfig } from "types/JobConfig";

import { APP } from "@config/index";

import { BaseJob } from "./BaseJob";

import { Di } from "@enums/Di";
import { IFileService } from "@interfaces/services/IFileService";

import { getInstanceOf } from "@helpers/getInstanceOf";

@injectable()
export class ClearTemporaryUploadsDirectoryJob extends BaseJob {
  jobName = ClearTemporaryUploadsDirectoryJob.name;

  config: JobConfig = {
    time: "59 23 * * *",
    runners: {
      onTick: this.onTick.bind(this),
    },
    options: {
      runOnInit: true,
    },
  };

  constructor() {
    super();
  }

  async onTick() {
    APP.IS_CLEARING_TEMPORARY_UPLOADS_DIR = true;

    const fileService = getInstanceOf<IFileService>(Di.FileService);

    await fileService.clearTemporaryDir();

    this.onComplete();
  }

  onComplete() {
    APP.IS_CLEARING_TEMPORARY_UPLOADS_DIR = false;

    console.log(`CRON: ${this.jobName} completed.`);
  }
}
