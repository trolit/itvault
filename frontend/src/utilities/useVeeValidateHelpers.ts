import type { FormMeta } from "vee-validate";
import type { ComputedRef } from "vue";

export const useVeeValidateHelpers = (
  meta: ComputedRef<FormMeta<Record<string, any>>>,
  errors: ComputedRef<Partial<Record<string, string | undefined>>>
) => {
  function hasError(propertyName: string) {
    const message = errors.value[propertyName];

    return meta.value.touched && message ? "error" : undefined;
  }

  function getError(propertyName: string) {
    const message = errors.value[propertyName];

    return meta.value.touched ? message : undefined;
  }

  return { hasError, getError };
};
