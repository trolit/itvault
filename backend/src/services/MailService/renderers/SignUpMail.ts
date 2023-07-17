import { IMailRenderer } from "@interfaces/IMailRenderer";

export class SignUpMail implements IMailRenderer<unknown> {
  // @TODO

  render(data: unknown): string {
    throw new Error("Method not implemented.");
  }
}
