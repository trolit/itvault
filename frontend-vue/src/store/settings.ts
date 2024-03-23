import { defineStore } from "pinia";

interface IState {
  activeKey: string;
}

export const useSettingsStore = defineStore("settings", {
  state: (): IState => ({
    activeKey: "app",
  }),

  getters: {},

  actions: {},
});
