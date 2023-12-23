import axios from "axios";
import { defineStore } from "pinia";

import type { ITagDto } from "@shared/types/dtos/Tag";
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

      return axios.get<PaginatedResponse<ITagDto>>("v1/tags", {
        params,
      });
    },
  },
});
