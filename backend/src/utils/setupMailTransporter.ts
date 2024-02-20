import nodemailer from "nodemailer";

import { EMAIL } from "@config";

import { Dependency } from "@enums/Dependency";

const { HOST, PORT, USER, PASSWORD } = EMAIL;

export const setupMailTransporter = () => {
  log.debug({
    dependency: Dependency.nodemailer,
    message: "Initializing nodemailer...",
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
};
