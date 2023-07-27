import yup from "yup";
import { DeepPartial, FindManyOptions, FindOptionsWhere } from "typeorm";
import { IBaseRepository } from "@interfaces/repositories/IBaseRepository";

import { Di } from "@enums/Di";

declare module "yup" {
  interface NumberSchema {
    isEntityAvailable(options: {
      message?: string;
      repositoryName: string;
      where: <T>(value: number) => object;
    }): this;
  }
}
