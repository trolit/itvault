import nodemailer from "nodemailer";

import { EMAIL } from "@config";

const { HOST, PORT, USER, PASSWORD } = EMAIL;

export const setupMailTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: HOST,
    port: PORT,
    secure: false,
    auth: {
      type: "login",
      user: USER,
      pass: PASSWORD,
    },
  });

  transporter.verify(error => {
    if (error) {
      console.log("NODEMAILER: invalid config!!");
      console.log(error);
    }
  });

  return transporter;
};
