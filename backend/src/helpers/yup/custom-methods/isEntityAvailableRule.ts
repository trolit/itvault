import { FindOptionsWhere } from "typeorm";
import { addMethod, number, NumberSchema } from "yup";

import { IBaseRepository } from "@interfaces/repositories/IBaseRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

addMethod<NumberSchema>(
  number,
  "isEntityAvailableRule",
  function (
    repositoryToken: string,
    where: FindOptionsWhere<any>,
    message?: string
  ) {
    return this.test(async (value, ctx) => {
      if (!value) {
        return ctx.createError();
      }

      const repository =
        getInstanceOf<IBaseRepository<unknown>>(repositoryToken);

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
