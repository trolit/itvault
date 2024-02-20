import nodemailer from "nodemailer";
import { IMailTransporterFactory } from "types/factories/IMailTransporterFactory";

import { EMAIL } from "@config";

import { Dependency } from "@enums/Dependency";

export class MailTransporterFactory implements IMailTransporterFactory {
  create() {
    const { HOST, PORT, USER, PASSWORD } = EMAIL;

    log.debug({
      dependency: Dependency.nodemailer,
      message: "Creating transport...",
    });

    const transporter = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      auth: {
        type: "login",
        user: USER,
        pass: PASSWORD,
      },
    });

    transporter.verify(error => {
      if (error) {
        log.error({
          error,
          dependency: Dependency.nodemailer,
          message: `Invalid config!`,
        });
      }
    });

    return transporter;
  }
}
