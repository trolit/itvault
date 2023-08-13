import { defineStore } from "pinia";

interface IState {}

export const useVariantsStore = defineStore("variants", {
  state: (): IState => ({}),
});
