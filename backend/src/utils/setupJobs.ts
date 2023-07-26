import path from "path";
import fs from "fs-extra";

import { IJob } from "@interfaces/IJob";

const allJobs = [];

export const setupJobs = async () => {
  const dir = path.join("dist", "jobs");

  const files = await fs.readdir(dir);

  for (const file of files) {
    const [dependencyFilename] = file.split(".");

    if (dependencyFilename === "BaseJob") {
      continue;
    }

    const module = await import(`@jobs/${dependencyFilename}`);

    const job = module[dependencyFilename] as IJob;

    job.run();

    allJobs.push(job);
  }
};
