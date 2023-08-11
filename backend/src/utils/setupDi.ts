import fs from "fs";
import path from "path";
import Redis from "ioredis/built/Redis";
import { Transporter } from "nodemailer";
import { container, DependencyContainer } from "tsyringe";

import { FILES } from "@config/index";

import { Di } from "@enums/Di";
import { FileStorageMode } from "@enums/FileStorageMode";

import { LocalFileService } from "@services/FileService/LocalFileService";
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

  registerDependenciesByInterfaces({
    sourceFiles: {
      dirname: "repositories",
      excludedFilenames: ["BaseRepository"],
    },
    interfacesDirname: "repositories",
  });

  registerDependenciesByInterfaces({
    sourceFiles: {
      dirname: "services",
      excludedFilenames: ["FileService"],
    },
    interfacesDirname: "services",
  });

  registerDependenciesByInterfaces({
    sourceFiles: {
      dirname: "factories",
      excludedFilenames: [],
    },
    interfacesDirname: "factories",
  });

  registerMailViewBuilders();

  return new Promise(resolve =>
    setInterval(() => {
      // @NOTE wait for dependencies that must be available instantly
      if (container.isRegistered(Di.RoleRepository)) {
        resolve(container);
      }
    }, 1000)
  );
};

function registerMailViewBuilders() {
  const dir = path.join("dist", "services", "MailService", "view-builders");

  fs.readdir(dir, async (error, files) => {
    for (const file of files) {
      const [dependencyFilename] = file.split(".");

      const module = await import(
        `@services/MailService/view-builders/${file}`
      );

      const Dependency = module[dependencyFilename];

      container.register(dependencyFilename, Dependency);
    }
  });
}

function registerDependenciesByInterfaces(config: {
  sourceFiles: { dirname: string; excludedFilenames: string[] };
  interfacesDirname: string;
}) {
  const {
    sourceFiles: { dirname, excludedFilenames },
    interfacesDirname,
  } = config;

  const dependencyInterfacePath = path.join("dist", "types", interfacesDirname);

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

        const Dependency = module[dependencyFilename];

        container.register(interfaceName, Dependency);
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
