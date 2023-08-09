import path from "path";
import fs from "fs-extra";
import mustache from "mustache";
import { Transporter } from "nodemailer";
import camelCase from "lodash/camelCase";
import { inject, injectable } from "tsyringe";
import { Options } from "nodemailer/lib/mailer";
import { IMailViewBuilder } from "types/mail/IMailViewBuilder";
import { IMailService } from "types/services/IMailService";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

@injectable()
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
    private _mailTransporter: Transporter<T>
  ) {}

  async buildHtml(viewBuilderName: string, data: object): Promise<string> {
    const templateFilename = viewBuilderName.replace("ViewBuilder", "");

    const template = await fs.readFile(
      path.join(this._templatesDir, `${camelCase(templateFilename)}.mustache`)
    );

    const viewBuilder = getInstanceOf<IMailViewBuilder<T>>(viewBuilderName);

    const view = viewBuilder.build(<T>data);

    return this._renderHtml(view, { contentTemplate: template.toString() });
  }

  private async _renderHtml(view: T, partials: { contentTemplate: string }) {
    const { contentTemplate } = partials;

    const baseTemplateBuffer = await fs.readFile(
      path.join(this._templatesDir, `base.mustache`)
    );

    return mustache.render(baseTemplateBuffer.toString(), view, {
      content: contentTemplate,
    });
  }

  sendMail(mailOptions: Options): Promise<T> {
    return this._mailTransporter.sendMail(mailOptions);
  }
}
