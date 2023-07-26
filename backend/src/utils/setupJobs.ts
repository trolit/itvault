import path from "path";
import fs from "fs-extra";

import { Di } from "@enums/Di";
import { IJobFactory } from "@interfaces/factories/IJobFactory";

import { getInstanceOf } from "@helpers/getInstanceOf";

const allJobs = [];

export const setupJobs = async () => {
  const dir = path.join("dist", "jobs");

  const files = await fs.readdir(dir);

  const jobFactory = getInstanceOf<IJobFactory>(Di.JobFactory);

  for (const file of files) {
    const [dependencyFilename] = file.split(".");

    if (dependencyFilename === "BaseJob") {
      continue;
    }

    const Job = await import(`@jobs/${dependencyFilename}`);

    const job = jobFactory.create(Job);

    job.run();

    allJobs.push(job);
  }
};
