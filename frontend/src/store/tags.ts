import axios from "axios";
import { defineStore } from "pinia";

import type { ITagDto } from "@shared/types/dtos/ITagDto";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

interface IState {
  items: ITagDto[];
}

export const useTagsStore = defineStore("tags", {
  state: (): IState => ({
    items: [],
  }),

  actions: {
    async getBySearch(search: string) {
      if (!search) {
        return;
      }

      const params = {
        version: 1,
        search,
        page: 1,
        perPage: 6,
      };

      const { data } = await axios.get<PaginatedResponse<ITagDto>>("v1/tags", {
        params,
      });

      this.items = data.result;

      return data;
    },
  },
});
