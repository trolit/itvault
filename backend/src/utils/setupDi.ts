import fs from "fs";
import path from "path";
import { Server } from "engine.io";
import Redis from "ioredis/built/Redis";
import { Transporter } from "nodemailer";
import { container, DependencyContainer, Lifecycle } from "tsyringe";

import { APP, FILES } from "@config";

import { initializeS3Client } from "./initializeS3Client";

import { Di } from "@enums/Di";
import { FileStorageMode } from "@enums/FileStorageMode";

import { S3FileService } from "@services/FileService/S3FileService";
import { SocketServiceManager } from "@services/SocketService/Manager";
import { LocalFileService } from "@services/FileService/LocalFileService";
import { MailConsumerHandler } from "@consumer-handlers/MailConsumerHandler";
import { BundleConsumerHandler } from "@consumer-handlers/BundleConsumerHandler";

export const setupDi = (services: {
  redis?: Redis;
  engineIo?: Server;
  mailTransporter?: Transporter;
}): Promise<DependencyContainer> => {
  const { mailTransporter, redis, engineIo } = services;

  if (FILES.ACTIVE_MODE === FileStorageMode.AWS) {
    container.register(Di.S3Client, { useValue: initializeS3Client() });
  }

  if (engineIo) {
    container.register(Di.EngineIO, { useValue: engineIo });
  }

  if (redis) {
    container.register(Di.Redis, { useValue: redis });
  }

  if (mailTransporter) {
    container.register(Di.MailTransporter, { useValue: mailTransporter });
  }

  container.register(Di.SocketServiceManager, SocketServiceManager, {
    lifecycle: Lifecycle.Singleton,
  });

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
      excludedFilenames: ["FileService", "SocketService"],
      // @TODO allow to declare custom registers (e.g. SocketServiceManager)
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

  return new Promise(resolve => {
    const interval = setInterval(() => {
      // @NOTE wait for dependencies that must be available instantly
      if (container.isRegistered(Di.RoleRepository)) {
        clearInterval(interval);

        resolve(container);
      }
    }, 1000);
  });
};

function registerMailViewBuilders() {
  const dir = path.join(
    APP.BASE_DIR,
    "services",
    "MailService",
    "view-builders"
  );

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

  const dependencyInterfacePath = path.join(
    APP.BASE_DIR,
    "types",
    interfacesDirname
  );

  const dir = path.join(APP.BASE_DIR, dirname);

  fs.readdir(dir, async (error, files) => {
    for (const file of files) {
      const dependencyFilename = file.includes(".") ? file.split(".")[0] : file;

      if (excludedFilenames.includes(dependencyFilename)) {
        continue;
      }

      const interfaceName = `I${dependencyFilename}`;

      if (
        fs.existsSync(
          path.join(
            dependencyInterfacePath,
            `${interfaceName}.${APP.BASE_DIR === "dist" ? "js" : "ts"}`
          )
        )
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

  if (FILES.ACTIVE_MODE === FileStorageMode.AWS) {
    container.register(Di.FileService, S3FileService);
  }
}

function registerConsumerHandlers() {
  container.register(Di.GenerateBundleConsumerHandler, BundleConsumerHandler);

  container.register(Di.SendMailConsumerHandler, MailConsumerHandler);
}
