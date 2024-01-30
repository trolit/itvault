import { defineStore } from "pinia";

interface IState {
  activeKey: string;
}

export const useInsightsStore = defineStore("insights", {
  state: (): IState => ({
    activeKey: "members",
  }),

  getters: {},

  actions: {},
});
