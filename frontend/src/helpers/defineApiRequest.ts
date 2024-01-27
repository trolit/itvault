import { ref } from "vue";

import { useGeneralStore } from "@/store/general";
import type { ErrorHandler, CallHandler } from "@/types/ApiRequestDefinition";

export const defineApiRequest = <T = void>(config: {
  callHandler: CallHandler<T>;
  errorHandler: ErrorHandler;
}) => {
  const isLoading = ref(false);
  const generalStore = useGeneralStore();

  const printSuccess = (message: string) =>
    generalStore.messageProvider.success(message);

  const printError = (message: string) =>
    generalStore.messageProvider.error(message);

  const { callHandler, errorHandler } = config;

  return {
    isLoading,
    onSubmit: (data: T) => {
      if (isLoading.value) {
        return;
      }

      isLoading.value = true;

      (async () => {
        try {
          await callHandler(printSuccess, data);
        } catch (error) {
          console.error(error);

          if (errorHandler) {
            await errorHandler(error, printError);
          }
        } finally {
          isLoading.value = false;
        }
      })();
    },
  };
};
