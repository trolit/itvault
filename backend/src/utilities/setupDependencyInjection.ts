import fs from "fs";
import path from "path";
import { container } from "tsyringe";

export const setupDependencyInjection = () => {
  registerDependenciesFromRequestedLocation("repositories");

  registerDependenciesFromRequestedLocation("services");
};

function registerDependenciesFromRequestedLocation(requestedLocation: string) {
  const dependencyInterfacePath = path.join("src", "interfaces");

  fs.readdir(`src/${requestedLocation}`, (error, files) => {
    files.forEach(async file => {
      const [dependencyFilename] = file.split(".");

      const interfaceName = `I${dependencyFilename}`;

      console.log(path.join(dependencyInterfacePath, `${interfaceName}.ts`));

      if (
        fs.existsSync(path.join(dependencyInterfacePath, `${interfaceName}.ts`))
      ) {
        const dependency = await import(
          `@${requestedLocation}/${dependencyFilename}.js`
        );

        container.register(interfaceName, dependency);
      } else {
        console.log(`⚠️⚠️⚠️  Failed to register --> ${dependencyFilename} <--`);
      }
    });
  });
}
