import { defineStore } from "pinia";
import cloneDeep from "lodash/cloneDeep";

import { useWorkspacesStore } from "./workspaces";
import type { AssignColorSelectionData } from "@/types/AssignColorSelectionData";

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

    colorActiveBucketPart(data: AssignColorSelectionData) {
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
        let elementIndex =
          lineIndex === startLineIndex ? anchorChildrenIndex : 0;

        const lineChildren = Array.from(line.children);
        const lineChildrenLength = lineChildren.length;

        const from = this.determineGlobalLineIndex(
          lineChildren,
          elementIndex,
          lineIndex === startLineIndex ? anchorOffset : 0
        );
        let to = 0;

        for (; elementIndex < lineChildrenLength; elementIndex++) {
          const node = lineChildren[elementIndex];

          const location = node.getAttribute("location");

          if (location) {
            this.removeActiveBucketPart(lineIndex, location);
          }

          if (node.textContent) {
            const localIndex =
              elementIndex === focusChildrenIndex &&
              (isSingleLine || isLastLine)
                ? focusOffset
                : node.textContent.length;

            to = this.determineGlobalLineIndex(
              lineChildren,
              elementIndex,
              localIndex
            );
          }

          if (elementIndex !== focusChildrenIndex) {
            continue;
          }

          if (isSingleLine || isLastLine) {
            break;
          }
        }

        this.addPartToActiveBucket(lineIndex, `${from}-${to - 1}`);
      }
    },

    determineGlobalLineIndex(
      lineChildren: Element[],
      nodeIndex: number,
      localIndex: number
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

    addPartToActiveBucket(lineIndex: number, location: string) {
      const workspacesStore = useWorkspacesStore();

      const activeBucket = workspacesStore.activeBucket;

      if (!activeBucket) {
        return;
      }

      activeBucket.value[lineIndex]
        ? activeBucket.value[lineIndex].push(location)
        : (activeBucket.value[lineIndex] = [location]);
    },

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
