import {
  useForm,
  useField,
  type GenericObject,
  type FieldContext,
} from "vee-validate";
import type { Schema } from "yup";
import { toTypedSchema } from "@vee-validate/yup";

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

    fields[parsedKey] = useField(key);
  });

  const { getError, hasError } = useVeeValidateHelpers(meta, errors);

  return {
    getError,
    hasError,
    setErrors,
    resetForm,

    fields,
    handleSubmit,
    currentFormData,

    setFormData: <
      (fields: GenericObject, shouldValidate?: boolean | undefined) => void
    >setValues,
  };
};
