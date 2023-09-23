import { defineStore } from "pinia";
import cloneDeep from "lodash/cloneDeep";

import { useWorkspacesStore } from "./workspaces";
import type { AssignColorSelectionData } from "@/types/AssignColorSelectionData";

interface IState {}

export const useBucketsStore = defineStore("buckets", {
  state: (): IState => ({}),

  actions: {
    paintData(data: AssignColorSelectionData) {
      const workspacesStore = useWorkspacesStore();

      const activeBucket = workspacesStore.activeBucket;

      if (!activeBucket) {
        return;
      }

      const {
        startLineIndex,
        endLineIndex,
        anchorChildrenIndex,
        focusChildrenIndex,
        anchorOffset,
        focusOffset,
      } = data;

      const isSingleLine = startLineIndex === endLineIndex;

      for (
        let lineIndex = startLineIndex;
        lineIndex <= endLineIndex;
        lineIndex++
      ) {
        const line = document.getElementById(`line-${lineIndex}`);

        if (!line) {
          break;
        }

        const isLastLine = lineIndex === endLineIndex;
        // @NOTE when first line - start from anchor node
        let nodeIndex = lineIndex === startLineIndex ? anchorChildrenIndex : 0;

        const lineChildren = Array.from(line.children);
        const lineChildrenLength = lineChildren.length;

        const from = this.localIndexToGlobalIndex(
          lineIndex === startLineIndex ? anchorOffset : 0,
          nodeIndex,
          lineChildren
        );
        let to = 0;

        for (; nodeIndex < lineChildrenLength; nodeIndex++) {
          const node = lineChildren[nodeIndex];

          const location = node.getAttribute("location");

          if (location) {
            this.removeFromValue(lineIndex, location);
          }

          if (node.textContent) {
            const localIndex =
              nodeIndex === focusChildrenIndex && (isSingleLine || isLastLine)
                ? focusOffset
                : node.textContent.length;

            to = this.localIndexToGlobalIndex(
              localIndex,
              nodeIndex,
              lineChildren
            );
          }

          if (nodeIndex !== focusChildrenIndex) {
            continue;
          }

          if (isSingleLine || isLastLine) {
            break;
          }
        }

        this.addToValue(lineIndex, `${from}-${to - 1}`);
      }
    },

    localIndexToGlobalIndex(
      localIndex: number,
      nodeIndex: number,
      lineChildren: Element[]
    ) {
      let length = 0;

      for (let index = 0; index < nodeIndex; index++) {
        const node = lineChildren[index];

        if (node.textContent) {
          length += node.textContent.length;
        }
      }

      return localIndex + length;
    },

    addToValue(lineIndex: number, location: string) {
      const workspacesStore = useWorkspacesStore();

      const activeBucket = workspacesStore.activeBucket;

      if (!activeBucket) {
        return;
      }

      activeBucket.value[lineIndex]
        ? activeBucket.value[lineIndex].push(location)
        : (activeBucket.value[lineIndex] = [location]);
    },

    removeFromValue(lineIndex: number, location: string) {
      const workspacesStore = useWorkspacesStore();

      const activeBucket = workspacesStore.activeBucket;

      if (!activeBucket) {
        return;
      }

      const line = activeBucket.value[lineIndex];

      const [from, to] = location.split("-");

      const fixedLocation = `${from}-${parseInt(to) - 1}`;

      const index = line.findIndex(coloring => coloring === fixedLocation);

      if (~index) {
        line.splice(index, 1);
      }
    },

    resetValue() {
      const workspacesStore = useWorkspacesStore();

      const activeBucket = workspacesStore.activeBucket;

      if (!activeBucket) {
        return;
      }

      activeBucket.value = cloneDeep(activeBucket.initialValue);
    },
  },
});
