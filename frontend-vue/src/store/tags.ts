import axios from "axios";
import { defineStore } from "pinia";

import type { ITagDTO } from "@shared/types/DTOs/Tag";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

interface IState {}

export const useTagsStore = defineStore("tags", {
  state: (): IState => ({}),

  actions: {
    async getBySearch(search: string) {
      const params = {
        version: 1,
        search,
        page: 1,
        perPage: 6,
      };

      return axios.get<PaginatedResponse<ITagDTO>>("v1/tags", {
        params,
      });
    },
  },
});
