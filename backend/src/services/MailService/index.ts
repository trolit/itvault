import path from "path";
import fs from "fs-extra";
import mustache from "mustache";
import { inject } from "tsyringe";
import camelCase from "lodash/camelCase";
import { Transporter } from "nodemailer";
import { Options } from "nodemailer/lib/mailer";

import { Di } from "@enums/Di";
import { IMailViewBuilder } from "@interfaces/IMailViewBuilder";
import { IMailService } from "@interfaces/services/IMailService";

import { getInstanceOf } from "@helpers/getInstanceOf";

export class MailService<T> implements IMailService<T> {
  private _templatesDir: string = path.join(
    ".",
    "dist",
    "services",
    "MailService",
    "templates"
  );

  constructor(
    @inject(Di.MailTransporter)
    private _mailTransporter: Transporter
  ) {}

  async buildHtml(viewBuilderName: string, data: T): Promise<string> {
    const template = await fs.readFile(
      path.join(this._templatesDir, `${camelCase(viewBuilderName)}.mustache`)
    );

    const viewBuilder = getInstanceOf<IMailViewBuilder<T>>(viewBuilderName);

    const view = viewBuilder.build(data);

    return this._renderHtml(view, { contentTemplate: template.toString() });
  }

  private async _renderHtml(view: T, partials: { contentTemplate: string }) {
    const baseTemplateBuffer = await fs.readFile(
      path.join(this._templatesDir, `base.mustache`)
    );

    return mustache.render(baseTemplateBuffer.toString(), view, partials);
  }

  sendMail(mailOptions: Options): Promise<T> {
    return this._mailTransporter.sendMail(mailOptions);
  }
}
