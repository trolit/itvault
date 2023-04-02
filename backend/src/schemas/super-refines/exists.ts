import { container } from "tsyringe";
import Zod, { RefinementCtx, ZodIssueCode } from "zod";

import { Di } from "@enums/Di";
import { IBaseRepository } from "@interfaces/IBaseRepository";

export const existsSuperRefine = <T>(repository: Di) => {
  return async (value: number, context: RefinementCtx) => {
    if (value <= 0) {
      context.addIssue({
        code: ZodIssueCode.custom,
        message: "Must be greater than 0.",
      });

      return Zod.NEVER;
    }

    const repositoryInstance: IBaseRepository<T> = <IBaseRepository<T>>(
      container.resolve<T>(repository)
    );

    const result = await repositoryInstance.findById(value);

    if (!result) {
      context.addIssue({
        code: ZodIssueCode.custom,
        message: "Requested resource is not available.",
      });
    }
  };
};
