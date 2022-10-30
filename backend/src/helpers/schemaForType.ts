import { ZodType } from "zod";

// @INFO https://github.com/colinhacks/zod/issues/372#issuecomment-826380330
export const schemaForType =
  <T>() =>
  <S extends ZodType<T>>(arg: S) => {
    return arg;
  };
