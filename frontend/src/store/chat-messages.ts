import axios from "axios";
import { defineStore } from "pinia";
import cloneDeep from "lodash/cloneDeep";

import type {
  IChatMessageDTO,
  IAddChatMessageDTO,
  IPatchChatMessageValueDTO,
} from "@shared/types/DTOs/ChatMessage";
import type { ChatMessage } from "@/types/ChatMessage";
import { WORKSPACE_CHAT_MAX_DEPTH } from "@shared/constants/config";
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

  getters: {
    ITEMS_PER_PAGE: () => 10,
    MAX_DEPTH: () => WORKSPACE_CHAT_MAX_DEPTH,
    NESTED_ITEMS_BY_DEPTH(): ChatMessage[] {
      const firstDepthItems = cloneDeep(
        this.items.filter(item => item.depth === 1)
      );

      const createChatMessageItem = (item: IChatMessageDTO) => {
        const chatMessageItem: ChatMessage = { ...item, replies: [] };

        const replies = this.items.filter(
          element => element.replyToId === item.id
        );

        if (!replies.length) {
          return chatMessageItem;
        }

        chatMessageItem.replies = replies.map(reply =>
          createChatMessageItem(reply)
        );

        return chatMessageItem;
      };

      return firstDepthItems.map(item => createChatMessageItem(item));
    },
  },

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
