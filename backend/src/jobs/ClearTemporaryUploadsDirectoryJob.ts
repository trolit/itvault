import { injectable } from "tsyringe";

import { BaseJob } from "./BaseJob";

import { Di } from "@enums/Di";
import { JobConfig } from "miscellaneous-types";
import { IFileService } from "@interfaces/services/IFileService";

import { getInstanceOf } from "@helpers/getInstanceOf";

@injectable()
export class ClearTemporaryUploadsDirectoryJob extends BaseJob {
  jobName = ClearTemporaryUploadsDirectoryJob.name;

  config: JobConfig = {
    time: "59 23 * * *",
    runners: { onTick: this.onTick.bind(this) },
    options: {
      runOnInit: true,
    },
  };

  constructor() {
    super();
  }

  async onTick() {
    const fileService = getInstanceOf<IFileService>(Di.FileService);

    await fileService.clearTemporaryDir();
  }
}
