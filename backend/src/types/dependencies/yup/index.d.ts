import yup from "yup";
import { DeepPartial, FindOptionsWhere } from "typeorm";
import { IBaseRepository } from "@interfaces/repositories/IBaseRepository";

import { Di } from "@enums/Di";

declare module "yup" {
  interface NumberSchema {
    isEntityAvailable<T>(
      repositoryToken: string,
      where: FindOptionsWhere<T>,
      message?: string
    ): this;
  }

  // @NOTE https://vee-validate.logaretm.com/v3/advanced/server-side-validation.html#setting-errors-manually
  export type FormattedError = Record<string, string[]>;
}
