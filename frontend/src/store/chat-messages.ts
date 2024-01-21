import axios from "axios";
import { defineStore } from "pinia";

import type {
  IChatMessageDTO,
  IAddChatMessageDTO,
  IPatchChatMessageValueDTO,
} from "@shared/types/DTOs/ChatMessage";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

interface IState {
  total: number;
  items: IChatMessageDTO[];
}

export const useChatMessagesStore = defineStore("chat-messages", {
  state: (): IState => ({
    total: 0,
    items: [],
  }),

  getters: {},

  actions: {
    async getAll(options: IPaginationQuery & { messageId?: number }) {
      const params = {
        version: 1,
        ...options,
      };

      const { data } = await axios.get<PaginatedResponse<IChatMessageDTO>>(
        "v1/chat-messages",
        {
          params,
        }
      );

      const { total, result } = data;

      this.items = Array.prototype.concat(this.items, result);

      this.total = total;

      return data;
    },

    add(payload: IAddChatMessageDTO) {
      const params = {
        version: 1,
      };

      return axios.post<PaginatedResponse<IChatMessageDTO>>(
        "v1/chat-messages",
        payload,
        {
          params,
        }
      );
    },

    update(id: number, payload: IPatchChatMessageValueDTO) {
      const params = {
        version: 1,
      };

      return axios.patch<PaginatedResponse<IChatMessageDTO>>(
        `v1/chat-messages/${id}/value`,
        payload,
        {
          params,
        }
      );
    },

    delete(id: number) {
      const params = {
        version: 1,
      };

      return axios.delete<PaginatedResponse<IChatMessageDTO>>(
        `v1/chat-messages/${id}`,
        {
          params,
        }
      );
    },
  },
});
