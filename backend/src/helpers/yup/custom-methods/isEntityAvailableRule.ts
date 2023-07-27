import { addMethod, number, NumberSchema } from "yup";

import { IBaseRepository } from "@interfaces/repositories/IBaseRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

addMethod<NumberSchema>(
  number,
  "isEntityAvailableRule",
  function (options: {
    message?: string;
    repositoryName: string;
    where: (value: number) => object;
  }) {
    const { message, repositoryName, where: buildWhere } = options;

    return this.test(async (value, ctx) => {
      if (!value) {
        return ctx.createError();
      }

      const repository =
        getInstanceOf<IBaseRepository<unknown>>(repositoryName);

      const where = buildWhere(value);

      const result = await repository.getOne({ where });

      if (!result) {
        return ctx.createError({
          message: message || "Resource not available",
        });
      }

      return true;
    });
  }
);
