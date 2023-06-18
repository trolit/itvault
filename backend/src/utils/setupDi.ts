import fs from "fs";
import path from "path";
import Redis from "ioredis/built/Redis";
import { container, DependencyContainer } from "tsyringe";

import { Di } from "@enums/Di";
import { FILES } from "@config/index";
import { FileStorageMode } from "@enums/FileStorageMode";
import { LocalFileService } from "@services/LocalFileService";

export const setupDi = (redis: Redis): Promise<DependencyContainer> => {
  container.register(Di.Redis, { useValue: redis });

  registerFileStorage();

  registerDependencies({
    sourceFiles: {
      dirname: "repositories",
      excludedFilenames: ["BaseRepository"],
    },
    interfacesDirname: "repository",
  });

  registerDependencies({
    sourceFiles: {
      dirname: "services",
      excludedFilenames: [],
    },
    interfacesDirname: "service",
  });

  registerDependencies({
    sourceFiles: {
      dirname: "factories",
      excludedFilenames: [],
    },
    interfacesDirname: "factory",
  });

  return new Promise(resolve =>
    setInterval(() => {
      // @NOTE wait for dependencies that must be available instantly
      if (container.isRegistered(Di.RoleRepository)) {
        resolve(container);
      }
    }, 1000)
  );
};

function registerDependencies(config: {
  sourceFiles: { dirname: string; excludedFilenames: string[] };
  interfacesDirname: string;
}) {
  const {
    sourceFiles: { dirname, excludedFilenames },
    interfacesDirname,
  } = config;

  const dependencyInterfacePath = path.join(
    "src",
    "interfaces",
    interfacesDirname
  );

  fs.readdir(`src/${dirname}`, async (error, files) => {
    for (const file of files) {
      const [dependencyFilename] = file.split(".");

      if (excludedFilenames.includes(dependencyFilename)) {
        continue;
      }

      const interfaceName = `I${dependencyFilename}`;

      if (
        fs.existsSync(path.join(dependencyInterfacePath, `${interfaceName}.ts`))
      ) {
        const dependency = await import(`@${dirname}/${dependencyFilename}`);

        container.register(interfaceName, dependency[dependencyFilename]);

        console.log(`⭐ ${dependencyFilename} registered in DI container`);
      } else {
        console.log(`❗❗❗ Failed to register ${dependencyFilename}`);
      }
    }
  });
}

function registerFileStorage() {
  if (FILES.STORAGE.MODE === FileStorageMode.Local) {
    container.register(Di.FileService, LocalFileService);

    console.log(`⭐ LocalFileService registered in DI container`);
  }
}
