import fs from "fs";
import path from "path";
import { container } from "tsyringe";

export const setupDi = () => {
  registerDependenciesFromRequestedLocation("repositories", ["BaseRepository"]);

  registerDependenciesFromRequestedLocation("services");
};

function registerDependenciesFromRequestedLocation(
  directory: string,
  filenamesToExclude: string[] = []
) {
  const dependencyInterfacePath = path.join("src", "interfaces");

  fs.readdir(`src/${directory}`, (error, files) => {
    files.forEach(async file => {
      const [dependencyFilename] = file.split(".");

      const interfaceName = `I${dependencyFilename}`;

      if (
        !filenamesToExclude.includes(dependencyFilename) &&
        fs.existsSync(path.join(dependencyInterfacePath, `${interfaceName}.ts`))
      ) {
        const dependency = await import(`@${directory}/${dependencyFilename}`);

        container.register(interfaceName, dependency[dependencyFilename]);

        console.log(`➕ Added ${dependencyFilename} to DI container`);
      } else {
        console.log(`⚠️⚠️⚠️  Failed to register --> ${dependencyFilename} <--`);
      }
    });
  });
}
