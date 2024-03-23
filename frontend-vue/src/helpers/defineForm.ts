import {
  useForm,
  useField,
  type GenericObject,
  type FieldContext,
} from "vee-validate";
import type { Schema } from "yup";
import { AxiosError } from "axios";
import { toTypedSchema } from "@vee-validate/yup";

import type { ApiError } from "@/types/ApiError";
import { useVeeValidateHelpers } from "@/utilities/useVeeValidateHelpers";

type FormFieldContext<T> = { [I in keyof T]: FieldContext<T[I]> };

export const defineForm = <T extends GenericObject>(
  initialFormData: T,
  schema: Schema<T>
) => {
  const typedSchema = toTypedSchema<Schema<T>>(schema);

  const {
    meta,
    errors,
    setErrors,
    setValues,
    resetForm,
    handleSubmit,
    values: currentFormData,
  } = useForm<T>({
    validationSchema: typedSchema,
  });

  const fields: FormFieldContext<T> = {} as FormFieldContext<T>;

  Object.keys(initialFormData).map(key => {
    const parsedKey = key as keyof T;

    fields[parsedKey] = useField(
      key,
      {},
      { initialValue: initialFormData[parsedKey] }
    );
  });

  const { getError, hasError } = useVeeValidateHelpers(meta, errors);

  const setValidationErrors = (error: unknown) => {
    if (error instanceof AxiosError) {
      const data: ApiError<{}> | undefined = error.response?.data;

      if (!data) {
        return;
      }

      const { body } = data;

      if (Object.keys(body)) {
        setErrors(data.body);
      }
    }
  };

  return {
    getError,
    hasError,
    resetForm,
    setValidationErrors,

    fields,
    handleSubmit,
    currentFormData,

    setFormData: <
      (fields: GenericObject, shouldValidate?: boolean | undefined) => void
    >setValues,
  };
};
