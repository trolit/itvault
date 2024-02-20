import { Transporter } from "nodemailer";

export interface IMailTransporterFactory {
  create(): Transporter;
}
