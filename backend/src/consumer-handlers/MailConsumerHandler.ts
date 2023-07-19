import { injectable, inject } from "tsyringe";

import { Di } from "@enums/Di";
import { IMailService } from "@interfaces/services/IMailService";
import { MailConsumerHandlerData } from "consumer-handlers-types";
import { IBaseConsumerHandler } from "@interfaces/IBaseConsumerHandler";

@injectable()
export class MailConsumerHandler
  implements IBaseConsumerHandler<MailConsumerHandlerData<unknown>>
{
  constructor(
    @inject(Di.FileRepository)
    private _mailService: IMailService<{ email: string }>
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
