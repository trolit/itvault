import { number } from "yup";
import { FindOptionsWhere } from "typeorm";

export const useIdNumberSchema = <T extends { id: number }>(
  repositoryName: string,
  where?: FindOptionsWhere<T>
) =>
  number()
    .required()
    .integer()
    .isEntityAvailable<T>(
      repositoryName,
      value =>
        ({
          id: value,
          ...where,
        } as FindOptionsWhere<T>)
    );
