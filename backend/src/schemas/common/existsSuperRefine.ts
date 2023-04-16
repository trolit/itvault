import Zod, { RefinementCtx, ZodIssueCode } from "zod";

import { Di } from "@enums/Di";
import { instanceOf } from "@helpers/instanceOf";
import { IBaseRepository } from "@interfaces/repository/IBaseRepository";

export const existsSuperRefine = <T>(repository: Di) => {
  return async (id: number, context: RefinementCtx) => {
    if (id <= 0) {
      context.addIssue({
        code: ZodIssueCode.custom,
        message: "Must be greater than 0.",
      });

      return Zod.NEVER;
    }

    const repositoryInstance = instanceOf<IBaseRepository<T>>(repository);

    const result = await repositoryInstance.findById(id);

    if (!result) {
      context.addIssue({
        code: ZodIssueCode.custom,
        message: "Requested resource is not available.",
      });
    }
  };
};
