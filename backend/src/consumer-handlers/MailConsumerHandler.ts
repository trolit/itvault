import isEqual from "lodash/isEqual";
import { injectable, inject } from "tsyringe";

import { Di } from "@enums/Di";
import { IMailService } from "@interfaces/services/IMailService";
import { MailConsumerHandlerData } from "consumer-handlers-types";
import { IBaseConsumerHandler } from "@interfaces/IBaseConsumerHandler";

@injectable()
export class MailConsumerHandler
  implements IBaseConsumerHandler<MailConsumerHandlerData>
{
  constructor(
    @inject(Di.FileRepository)
    private _mailService: IMailService<{ email: string }>
  ) {}

  async handle(data: MailConsumerHandlerData): Promise<boolean> {
    const { viewBuilderName, subject, ...userData } = data;

    const html = await this._mailService.buildHtml(viewBuilderName, userData);

    if (!html) {
      return false;
    }

    const response = await this._mailService.sendMail({
      to: userData.email,
      text: "TBA",
      subject,
      html,
    });

    return isEqual(userData, response);
  }

  async onError(data: MailConsumerHandlerData): Promise<void> {
    // @TODO
  }
}
