import nodemailer from "nodemailer";

import { EMAIL } from "@config";

import { Service } from "@enums/Service";

const { HOST, PORT, USER, PASSWORD } = EMAIL;

export const setupMailTransporter = () => {
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
        service: Service.nodemailer,
        message: `Invalid config!`,
      });
    }
  });

  return transporter;
};
