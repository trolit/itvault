import { ref, type Ref } from "vue";
import type { Schema } from "yup";
import type { GenericObject } from "vee-validate";

import type {
  ErrorHandler,
  FormCallHandler,
} from "@/types/ApiRequestDefinition";
import { defineForm } from "./defineForm";
import { useGeneralStore } from "@/store/general";

type VModel<E extends object> = { [I in keyof E]: Ref<E[I]> };

export const defineFormApiRequest = <T extends GenericObject>(config: {
  data: T;
  schema: Schema<T>;
  errorHandler: ErrorHandler;
  formCallHandler: FormCallHandler<T>;
}) => {
  const isLoading = ref(false);
  const generalStore = useGeneralStore();

  const printSuccess = (message: string) =>
    generalStore.messageProvider.success(message);

  const printError = (message: string) =>
    generalStore.messageProvider.error(message);

  const { data, schema, formCallHandler, errorHandler } = config;

  const {
    fields,
    getError,
    hasError,
    resetForm,
    setFormData,
    handleSubmit,
    currentFormData,
    setValidationErrors,
  } = defineForm(data, schema);

  const vModel: VModel<T> = Object.keys(fields).reduce<VModel<T>>(
    (accumulator, currentKey: keyof VModel<T>) => {
      if (!accumulator) {
        accumulator = {} as VModel<T>;
      }

      const field = fields[currentKey];

      accumulator[currentKey] = field.value;

      return accumulator;
    },
    {} as VModel<T>
  );

  return {
    vModel,
    fields,
    getError,
    hasError,
    resetForm,
    isLoading,
    setFormData,
    CURRENT_FORM_DATA: currentFormData,
    onSubmit: handleSubmit.withControlled(async formData => {
      if (isLoading.value) {
        return;
      }

      isLoading.value = true;

      try {
        await formCallHandler(formData, printSuccess);
      } catch (error) {
        console.error(error);

        setValidationErrors(error);

        if (errorHandler) {
          await errorHandler(error, printError);
        }
      } finally {
        isLoading.value = false;
      }
    }),
  };
};
