import fs from "fs";
import path from "path";
import Redis from "ioredis/built/Redis";
import { Transporter } from "nodemailer";
import { container, DependencyContainer } from "tsyringe";

import { FILES } from "@config/index";

import { Di } from "@enums/Di";
import { FileStorageMode } from "@enums/FileStorageMode";

import { LocalFileService } from "@services/LocalFileService";
import { MailConsumerHandler } from "@consumer-handlers/MailConsumerHandler";
import { LocalBundleConsumerHandler } from "@consumer-handlers/BundleConsumerHandler/Local";

export const setupDi = (
  redis: Redis,
  mailTransporter: Transporter
): Promise<DependencyContainer> => {
  container.register(Di.Redis, { useValue: redis });

  container.register(Di.MailTransporter, { useValue: mailTransporter });

  registerFileService();

  registerConsumerHandlers();

  registerDependencies({
    sourceFiles: {
      dirname: "repositories",
      excludedFilenames: ["BaseRepository"],
    },
    interfacesDirname: "repositories",
  });

  registerDependencies({
    sourceFiles: {
      dirname: "services",
      excludedFilenames: ["LocalFileService"],
    },
    interfacesDirname: "services",
  });

  registerDependencies({
    sourceFiles: {
      dirname: "factories",
      excludedFilenames: [],
    },
    interfacesDirname: "factories",
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
    "dist",
    "types",
    "interfaces",
    interfacesDirname
  );

  const dir = path.join("dist", dirname);

  fs.readdir(dir, async (error, files) => {
    for (const file of files) {
      const dependencyFilename = file.includes(".") ? file.split(".")[0] : file;

      if (excludedFilenames.includes(dependencyFilename)) {
        continue;
      }

      const interfaceName = `I${dependencyFilename}`;

      if (
        fs.existsSync(path.join(dependencyInterfacePath, `${interfaceName}.js`))
      ) {
        const module = await import(`@${dirname}/${dependencyFilename}`);

        const className = module[dependencyFilename];

        container.register(interfaceName, className);
      } else {
        console.log(`❗❗❗ Failed to register ${dependencyFilename}`);
      }
    }
  });
}

function registerFileService() {
  if (FILES.ACTIVE_MODE === FileStorageMode.Local) {
    container.register(Di.FileService, LocalFileService);
  }
}

function registerConsumerHandlers() {
  if (FILES.ACTIVE_MODE === FileStorageMode.Local) {
    container.register(
      Di.GenerateBundleConsumerHandler,
      LocalBundleConsumerHandler
    );
  }

  container.register(Di.SendMailConsumerHandler, MailConsumerHandler);
}
