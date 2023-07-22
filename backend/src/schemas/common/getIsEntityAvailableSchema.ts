import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { IBaseRepository } from "@interfaces/repositories/IBaseRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

export const getIsEntityAvailableSchema = <T, Y = void>(
  key: keyof Y | { id: string },
  repositoryToken: string,
  entityName: string
) =>
  z.object({
    [<string>key]: z.coerce
      .number()
      .gt(0)
      .superRefine(async (id, context: RefinementCtx) => {
        if (id <= 0) {
          return Zod.NEVER;
        }

        const repository = getInstanceOf<IBaseRepository<T>>(repositoryToken);

        const entity = await repository.getById(id);

        if (!entity) {
          context.addIssue({
            code: ZodIssueCode.custom,
            message: `${entityName} is not available.`,
          });

          return Zod.NEVER;
        }
      }),
  });
