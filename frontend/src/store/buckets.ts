import { defineStore } from "pinia";
import cloneDeep from "lodash/cloneDeep";

import type { LinePart } from "@/types/LinePart";
import { useWorkspacesStore } from "./workspaces";

interface IState {}

export const useBucketsStore = defineStore("buckets", {
  state: (): IState => ({}),

  actions: {
    resetActiveBucketValue() {
      const workspacesStore = useWorkspacesStore();

      const activeBucket = workspacesStore.activeBucket;

      if (!activeBucket) {
        return;
      }

      activeBucket.value = cloneDeep(activeBucket.initialValue);
    },

    removeActiveBucketPart(part: LinePart) {
      const workspacesStore = useWorkspacesStore();

      const activeBucket = workspacesStore.activeBucket;

      if (!activeBucket) {
        return;
      }

      const { lineIndex, location } = part;

      if (!location) {
    removeActiveBucketPart(lineIndex: number, originalLocation: string) {
      const workspacesStore = useWorkspacesStore();

      const activeBucket = workspacesStore.activeBucket;

      if (!activeBucket) {
        return;
      }

      const line = activeBucket.value[lineIndex];

      const [from, to] = originalLocation.split("-");

      const fixedLocation = `${from}-${parseInt(to) - 1}`;

      const index = line.findIndex(coloring => coloring === fixedLocation);

      if (~index) {
        line.splice(index, 1);
      }
    },
  },
});
