import { Options } from "nodemailer/lib/mailer";

export interface IMailService<T> {
  buildHtml(
    rendererName: string,
    data: T,
    partials: Record<string, boolean>
  ): Promise<string>;

  sendMail(mailOptions: Options): Promise<T>;
}
