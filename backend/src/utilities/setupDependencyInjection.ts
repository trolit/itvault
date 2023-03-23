import fs from "fs";
import path from "path";
import { container } from "tsyringe";

export const setupDependencyInjection = () => {
  registerDependenciesFromLocation("repositories");

  registerDependenciesFromLocation("services");
};

function registerDependenciesFromLocation(directory: string) {
  const dependencyInterfacePath = path.join("src", "interfaces");

  fs.readdir(`src/${directory}`, (error, files) => {
    files.forEach(async file => {
      const [dependencyFilename] = file.split(".");

      const interfaceName = `I${dependencyFilename}`;

      if (
        fs.existsSync(path.join(dependencyInterfacePath, `${interfaceName}.ts`))
      ) {
        const dependency = await import(
          `@${directory}/${dependencyFilename}.js`
        );

        container.register(interfaceName, dependency);
      } else {
        console.log(`⚠️⚠️⚠️  Failed to register --> ${dependencyFilename} <--`);
      }
    });
  });
}
