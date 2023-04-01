import { container } from "tsyringe";
import { RefinementCtx, ZodIssueCode } from "zod";

import { Di } from "@enums/Di";
import { IBaseRepository } from "@interfaces/IBaseRepository";

export const existsSuperRefine = <T>(repository: Di) => {
  return async (value: number, context: RefinementCtx) => {
    const repositoryInstance: IBaseRepository<T> = <IBaseRepository<T>>(
      container.resolve<T>(repository)
    );

    const result = await repositoryInstance.findById(value);

    if (!result) {
      return context.addIssue({
        code: ZodIssueCode.custom,
        message: "Requested resource is not available.",
      });
    }
  };
};
