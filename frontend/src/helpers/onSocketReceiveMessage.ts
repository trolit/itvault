import { watch } from "vue";
import { storeToRefs } from "pinia";

import { useAuthStore } from "@/store/auth";
import type { SocketReceiveMessage } from "@shared/types/transport/SocketReceiveMessage";

export const onSocketReceiveMessage = (
  onMessage: <T>(data: SocketReceiveMessage<T>) => void
) => {
  const authStore = useAuthStore();
  const { socket } = storeToRefs(authStore);

  watch(socket, value => {
    if (!value) {
      return;
    }

    value.on("message", data => {
      let parsedData;

      try {
        parsedData = JSON.parse(data);

        onMessage(parsedData);
      } catch (error) {
        console.log("Failed to parse incoming message!");
      }
    });
  });
};
