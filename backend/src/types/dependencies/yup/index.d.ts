import yup from "yup";
import { FindManyOptions, FindOptionsWhere } from "typeorm";

declare module "yup" {
  interface NumberSchema {
    isAvailable(options: {
      message?: string;
      where: (value: number) => FindOptionsWhere<unknown>;
    }): this;
  }
}
