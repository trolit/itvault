import axios from "axios";
import { defineStore } from "pinia";
import cloneDeep from "lodash/cloneDeep";

import type {
  IChatMessageDTO,
  IAddChatMessageDTO,
  IPatchChatMessageValueDTO,
} from "@shared/types/DTOs/ChatMessage";
import type {
  AddChatMessageData,
  UpdateChatMessageData,
  DeleteChatMessageData,
} from "@shared/types/transport/ChatMessages";
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

    onCreate(data: AddChatMessageData) {
      if (data.replyToId) {
        const index = this.items.findIndex(item => item.id === data.replyToId);

        if (index < 0) {
          return;
        }

        this.items[index].repliesCount++;
      }

      data.depth === 1 ? this.items.unshift(data) : this.items.push(data);

      this.total++;
    },

    onUpdate(data: UpdateChatMessageData) {
      const index = this.items.findIndex(item => item.id === data.id);

      if (~index) {
        this.items[index].value = data.value;
      }
    },

    onDelete(data: DeleteChatMessageData) {
      const indexToDelete = this.items.findIndex(item => item.id === data.id);

      if (indexToDelete < 0) {
        return;
      }

      const itemToDelete = this.items[indexToDelete];
      const parentItem = itemToDelete?.replyToId
        ? this.items.find(item => item.id === itemToDelete.replyToId)
        : undefined;

      if (parentItem) {
        parentItem.repliesCount--;
      }

      this.items.splice(indexToDelete, 1);

      this.total--;
    },
  },
});
