import { Options } from "nodemailer/lib/mailer";

export interface IMailService<T> {
  buildHtml(rendererName: string, data: T): string;

  sendMail(mailOptions: Options): Promise<T>;
}
