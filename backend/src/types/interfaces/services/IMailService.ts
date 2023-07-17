import { Options } from "nodemailer/lib/mailer";

export interface IMailService<T> {
  sendMail(mailOptions: Options): Promise<T>;
}
