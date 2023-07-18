import { Options } from "nodemailer/lib/mailer";

export interface IMailService<T> {
  buildHtml(rendererName: string, data: object): Promise<string>;

  sendMail(mailOptions: Options): Promise<T>;
}
