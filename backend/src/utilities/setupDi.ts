import fs from "fs";
import path from "path";
import Redis from "ioredis/built/Redis";
import { container, DependencyContainer } from "tsyringe";

import { Di } from "@enums/Di";

export const setupDi = (redis: Redis): DependencyContainer => {
  container.register(Di.Redis, { useValue: redis });

  registerDependenciesFrom("repositories", ["BaseRepository"]);

  registerDependenciesFrom("services");

  return container;
};

function registerDependenciesFrom(
  directory: string,
  filenamesToExclude: string[] = []
) {
  const dependencyInterfacePath = path.join("src", "interfaces");

  fs.readdir(`src/${directory}`, async (error, files) => {
    for (const file of files) {
      const [dependencyFilename] = file.split(".");

      if (filenamesToExclude.includes(dependencyFilename)) {
        continue;
      }

      const interfaceName = `I${dependencyFilename}`;

      if (
        fs.existsSync(path.join(dependencyInterfacePath, `${interfaceName}.ts`))
      ) {
        const dependency = await import(`@${directory}/${dependencyFilename}`);

        container.register(interfaceName, dependency[dependencyFilename]);

        console.log(`⭐ ${dependencyFilename} was registered in DI container`);
      } else {
        console.log(`❗❗❗ Failed to register ${dependencyFilename}`);
      }
    }
  });
}
