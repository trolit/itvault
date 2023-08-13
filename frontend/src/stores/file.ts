import { defineStore } from "pinia";

interface IState {
  ROOT: string;
}

export const useFilesStore = defineStore("files", {
  state: (): IState => ({
    ROOT: ".",
  }),
});
