import { defineStore } from "pinia";

interface IState {}

export const useBucketsStore = defineStore("buckets", {
  state: (): IState => ({}),

  actions: {},
});
