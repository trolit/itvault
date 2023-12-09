import { watch } from "vue";
import { storeToRefs } from "pinia";

import { useAuthStore } from "@/store/auth";

export const onSocketOpen = (callback: () => void) => {
  const authStore = useAuthStore();
  const { socket } = storeToRefs(authStore);

  watch(
    socket,
    value => {
      if (!value) {
        return;
      }

      callback();
    },
    { immediate: true }
  );
};
