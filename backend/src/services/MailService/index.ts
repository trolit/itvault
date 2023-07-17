import { inject } from "tsyringe";
import { Transporter } from "nodemailer";
import { Options } from "nodemailer/lib/mailer";

import { Di } from "@enums/Di";
import { IMailService } from "@interfaces/services/IMailService";

export class MailService<T> implements IMailService<T> {
  constructor(
    @inject(Di.MailTransporter)
    private _mailTransporter: Transporter
  ) {}

  // buildHtml

  sendMail(mailOptions: Options): Promise<T> {
    return this._mailTransporter.sendMail(mailOptions);
  }
}
