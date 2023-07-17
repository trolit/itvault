import nodemailer from "nodemailer";

import { EMAIL } from "@config";

const { HOST, PORT, USER, PASSWORD } = EMAIL;

export const setupMailTransporter = () => {
  return nodemailer.createTransport({
    host: HOST,
    port: PORT,
    auth: {
      type: "login",
      user: USER,
      pass: PASSWORD,
    },
  });
};
