import type { ComputedRef } from "vue";
import type { FormMeta, Path } from "vee-validate";

export const useVeeValidateHelpers = <T>(
  meta: ComputedRef<FormMeta<Record<string, any>>>,
  errors: ComputedRef<Partial<Record<Path<T>, string | undefined>>>
) => {
  function hasError(propertyName: Path<T>) {
    const message = errors.value[propertyName];

    return meta.value.touched && message ? "error" : undefined;
  }

  function getError(propertyName: Path<T>) {
    const message = errors.value[propertyName];

    return meta.value.touched ? message : undefined;
  }

  return { hasError, getError };
};
