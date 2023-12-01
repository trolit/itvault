import { ref } from "vue";
import type { Schema } from "yup";
import type { GenericObject } from "vee-validate";

import type {
  ErrorHandler,
  FormCallHandler,
} from "@/types/ApiRequestDefinition";
import { defineForm } from "./defineForm";
import { useGeneralStore } from "@/store/general";

export const defineFormApiRequest = <T extends GenericObject>(config: {
  data: T;
  schema: Schema<T>;
  errorHandler: ErrorHandler;
  formCallHandler: FormCallHandler;
}) => {
  const isLoading = ref(false);
  const generalStore = useGeneralStore();

  const printSuccess = (message: string) =>
    generalStore.messageProvider.success(message);

  const printError = (message: string) =>
    generalStore.messageProvider.error(message);

  const { data, schema, formCallHandler, errorHandler } = config;

  const { fields, getError, hasError, handleSubmit, setValidationErrors } =
    defineForm(data, schema);

  return {
    fields,
    getError,
    hasError,
    isLoading,
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
