import axios from "axios";
import { defineStore } from "pinia";

interface IState {}

export const useTagsStore = defineStore("tags", {
  state: (): IState => ({}),

  actions: {},
});
