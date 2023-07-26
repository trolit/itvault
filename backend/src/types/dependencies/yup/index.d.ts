import yup from "yup";
import { FindManyOptions, FindOptionsWhere } from "typeorm";

import { Di } from "@enums/Di";

declare module "yup" {
  interface NumberSchema {
    isAvailable(options: {
      message?: string;
      repositoryName: Di;
      where: (value: number) => FindOptionsWhere<unknown>;
    }): this;
  }
}
