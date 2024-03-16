import fs from "fs-extra";
import snakeCase from "lodash/snakeCase";

import { ITestsGroup } from "./types";

export const loadTestsGroups = async (suite: Mocha.Suite, dir: string) => {
  const unprivilegedTestGroups: ITestsGroup[] = [];
  const privilegedTestGroups: ITestsGroup[] = [];

  const dirContent = fs.readdirSync(dir);

  for (const dirElement of dirContent) {
    if (dirElement.includes(".")) {
      throw Error(
        `'${dir}' should only include dirs but found ${dirElement}!!`
      );
    }

    const module = await import(`${dir}/${dirElement}`);
    const value = `${snakeCase(dirElement).toUpperCase()}_TESTS`;

    const testsGroup: ITestsGroup = module[value];

    if (!testsGroup) {
      continue;
    }

    testsGroup._data.runInPrivilegedMode
      ? privilegedTestGroups.push(testsGroup)
      : unprivilegedTestGroups.push(testsGroup);
  }

  const testsGroups: ITestsGroup[] = privilegedTestGroups.length
    ? privilegedTestGroups
    : [...privilegedTestGroups, ...unprivilegedTestGroups];

  for (const testsGroup of testsGroups) {
    testsGroup.loadToSuite(suite);
  }

  return testsGroups;
};
