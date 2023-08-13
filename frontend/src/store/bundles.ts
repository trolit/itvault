import { defineStore } from "pinia";

interface IState {}

export const useBundlesStore = defineStore("bundles", {
  state: (): IState => ({}),

  actions: {},
});
