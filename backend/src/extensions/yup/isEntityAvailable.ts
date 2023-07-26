import { FindOptionsWhere } from "typeorm";
import { addMethod, number, NumberSchema } from "yup";

import { Di } from "@enums/Di";
import { IBaseRepository } from "@interfaces/repositories/IBaseRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

addMethod<NumberSchema>(
  number,
  "isAvailable",
  function (options: {
    message?: string;
    repositoryName: Di;
    where: (value: number) => FindOptionsWhere<unknown>;
  }) {
    const { message, repositoryName, where } = options;

    return this.test(async (value: unknown, ctx) => {
      const repository =
        getInstanceOf<IBaseRepository<unknown>>(repositoryName);

      const result = await repository.getOne(where(<number>value));

      if (result) {
        return ctx.createError({
          message: message || "Resource is not available.",
        });
      }

      return true;
    });
  }
);
