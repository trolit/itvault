import { defineStore } from "pinia";

import type { LinePart } from "@/types/LinePart";
import { useWorkspacesStore } from "./workspaces";

interface IState {}

export const useBucketsStore = defineStore("buckets", {
  state: (): IState => ({}),

  actions: {
    removePartFromActiveBucket(part: LinePart) {
      const workspacesStore = useWorkspacesStore();

      const activeBucket = workspacesStore.activeBucket;

      if (!activeBucket) {
        return;
      }

      const { lineIndex, location } = part;

      if (!location) {
        return;
      }

      const line = activeBucket.value[lineIndex];

      const index = line.findIndex(coloring => coloring === location.original);

      if (~index) {
        line.splice(index, 1);
      }
    },
  },
});
