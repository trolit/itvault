import { string } from "yup";
import isInteger from "lodash/isInteger";
import { IBaseRepository } from "types/repositories/IBaseRepository";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

export const useResourceEntityTest = () =>
  string()
    .required()
    .transform(value => (isInteger(parseInt(value)) ? parseInt(value) : value))
    .when("name", ([name], schema) => {
      if (!name || typeof name !== "string") {
        return schema.typeError(
          setYupError(CUSTOM_MESSAGES.NOTE.RESOURCE_NOT_SPECIFIED)
        );
      }

      return schema.test(async (value, ctx) => {
        const repository = getInstanceOf<IBaseRepository<unknown>>(
          `I${name}Repository`
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
