import { injectable, inject } from "tsyringe";
import { IMailService } from "types/services/IMailService";
import { IBaseConsumerHandler } from "types/consumer-handlers/IBaseConsumerHandler";
import { MailConsumerHandlerData } from "types/consumer-handlers/MailConsumerHandlerData";

import { Di } from "@enums/Di";

@injectable()
export class MailConsumerHandler
  implements IBaseConsumerHandler<MailConsumerHandlerData<unknown>>
{
  constructor(
    @inject(Di.MailService)
    private _mailService: IMailService<unknown>
  ) {}

  async handle(data: MailConsumerHandlerData<unknown>): Promise<boolean> {
    const { viewBuilderName, subject, sendTo, ...mailData } = data;

    const html = await this._mailService.buildHtml(viewBuilderName, mailData);

    if (!html) {
      return false;
    }

    try {
      await this._mailService.sendMail({
        to: sendTo,
        text: subject,
        subject,
        html,
      });

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  async onError(data: MailConsumerHandlerData<unknown>): Promise<void> {
    const { subject, sendTo } = data;

    console.error(`Failed to send '${subject}' email to ${sendTo}`);
  }
}
