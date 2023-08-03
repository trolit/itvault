import { number } from "yup";

import { IBaseRepository } from "@interfaces/repositories/IBaseRepository";

import { MESSAGES } from "@helpers/yup/messages";
import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";

export const useResourceEntityTest = () =>
  number()
    .required()
    .integer()
    .when("resource", ([resource], schema) => {
      if (!resource || typeof resource !== "string") {
        return schema.typeError(
          setYupError(MESSAGES.NOTE.RESOURCE_NOT_SPECIFIED)
        );
      }

      return schema.test(async (value, ctx) => {
        const repository = getInstanceOf<IBaseRepository<unknown>>(
          `I${resource}Repository`
        );

        const entity = await repository.getById(value);

        if (!entity) {
          return ctx.createError({
            message: setYupError(MESSAGES.NOTE.RESOURCE_NOT_AVAILABLE),
          });
        }

        return true;
      });
    });
