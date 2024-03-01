import fs from "fs-extra";

import { TestsGroup } from "./types";

export const loadTestsGroups = async (suite: Mocha.Suite, dir: string) => {
  const testGroups: TestsGroup[] = [];

  const dirContent = fs.readdirSync(dir);

  for (const dirElement of dirContent) {
    if (dirElement.includes(".")) {
      throw Error(
        `'${dir}' should only include dirs but found ${dirElement}!!`
      );
    }

    const module = await import(`${dir}/${dirElement}`);
    const value = `${dirElement.toUpperCase()}_TESTS`;

    const testsGroup = module[value];

    testGroups.push(testsGroup);

    testsGroup.loadToSuite(suite);
  }

  return testGroups;
};
