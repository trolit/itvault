import path from "path";
import fs from "fs-extra";
import { IJobFactory } from "types/factories/IJobFactory";

import { APP } from "@config";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

const allJobs = [];

export const setupJobs = async () => {
  const dir = path.join(APP.BASE_DIR, "jobs");

  const files = await fs.readdir(dir);

  const jobFactory = getInstanceOf<IJobFactory>(Di.JobFactory);

  for (const file of files) {
    const [dependencyFilename] = file.split(".");

    if (dependencyFilename === "BaseJob") {
      continue;
    }

    const JobDependency = await import(`@jobs/${dependencyFilename}`);

    const Job = JobDependency[dependencyFilename];

    const job = jobFactory.create(Job);

    job.run();

    allJobs.push(job);
  }
};
