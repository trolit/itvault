import { number } from "yup";

import { IBaseRepository } from "@interfaces/repositories/IBaseRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

export const useResourceEntityTest = () =>
  number()
    .required()
    .integer()
    .when("resource", ([resource], schema) => {
      if (!resource || typeof resource !== "string") {
        return schema.typeError("Resource not specified.");
      }

      return schema.test(async (value, ctx) => {
        const repository = getInstanceOf<IBaseRepository<unknown>>(
          `I${resource}Repository`
        );

        const entity = await repository.getById(value);

        if (!entity) {
          return ctx.createError({ message: "Resource is not available." });
        }

        return true;
      });
    });
