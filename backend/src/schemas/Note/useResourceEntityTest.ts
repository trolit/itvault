import { number } from "yup";

import { IBaseRepository } from "@interfaces/repositories/IBaseRepository";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

export const useResourceEntityTest = () =>
  number()
    .required()
    .integer()
    .when("resource", ([resource], schema) => {
      if (!resource || typeof resource !== "string") {
        return schema.typeError(
          setYupError(CUSTOM_MESSAGES.NOTE.RESOURCE_NOT_SPECIFIED)
        );
      }

      return schema.test(async (value, ctx) => {
        const repository = getInstanceOf<IBaseRepository<unknown>>(
          `I${resource}Repository`
        );

        const entity = await repository.getById(value);

        if (!entity) {
          return ctx.createError({
            message: setYupError(CUSTOM_MESSAGES.NOTE.RESOURCE_NOT_AVAILABLE),
          });
        }

        return true;
      });
    });
