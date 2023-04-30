import { RefinementCtx, ZodIssueCode } from "zod";

import { Di } from "@enums/Di";
import { instanceOf } from "@helpers/instanceOf";
import { IBaseRepository } from "@interfaces/repository/IBaseRepository";

export const existsSuperRefine = <T>(repository: Di) => {
  return async (id: number, context: RefinementCtx) => {
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
