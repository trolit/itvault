import { Options } from "nodemailer/lib/mailer";

export interface IMailService<T> {
  buildHtml(rendererName: string, data: T): Promise<string>;

  sendMail(mailOptions: Options): Promise<T>;
}
