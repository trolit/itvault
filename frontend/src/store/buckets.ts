import axios from "axios";
import { defineStore } from "pinia";
import cloneDeep from "lodash/cloneDeep";

import type { Bucket } from "@/types/Bucket";
import { useVariantsStore } from "./variants";
import { useBlueprintsStore } from "./blueprints";
import { useWorkspacesStore } from "./workspaces";
import type { IBucketDTO, IAddEditBucketDTO } from "@shared/types/DTOs/Bucket";
import type { AssignColorSelectionData } from "@/types/AssignColorSelectionData";

interface IState {}

export const useBucketsStore = defineStore("buckets", {
  state: (): IState => ({}),

  getters: {
    LINE_CLASS_NAME: () => "line",
    LOCATION_ATTRIBUTE_NAME: () => "location",
    activeItem(): Bucket | undefined {
      const { activeTab } = useVariantsStore();

      if (!activeTab) {
        return;
      }

      return activeTab.buckets.find(
        bucket => bucket.blueprintId === activeTab.activeBlueprintId
      );
    },
  },

  actions: {
    getLineId(value: number) {
      return `line-${value}`;
    },

    paintData(data: AssignColorSelectionData) {
      if (!this.activeItem) {
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
        const line = document.getElementById(this.getLineId(lineIndex));

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

          const location = node.getAttribute(this.LOCATION_ATTRIBUTE_NAME);

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
      const { activeItem: activeBucket } = this;

      if (!activeBucket) {
        return;
      }

      activeBucket.value[lineIndex]
        ? activeBucket.value[lineIndex].push(location)
        : (activeBucket.value[lineIndex] = [location]);
    },

    removeFromValue(lineIndex: number, location: string) {
      if (!this.activeItem) {
        return;
      }

      const line = this.activeItem.value[lineIndex];

      const [from, to] = location.split("-");

      const fixedLocation = `${from}-${parseInt(to) - 1}`;

      const index = line.findIndex(coloring => coloring === fixedLocation);

      if (~index) {
        line.splice(index, 1);

        line.length ? {} : delete this.activeItem.value[lineIndex];
      }
    },

    resetValue() {
      const { activeItem } = this;

      if (!activeItem) {
        return;
      }

      activeItem.value = cloneDeep(activeItem.initialValue);
    },

    async upsert() {
      const { activeItem: activeBucket } = this;
      const { activeTab: activeVariantTab } = useVariantsStore();
      const { activeItem: activeBlueprint } = useBlueprintsStore();
      const { activeItem: activeWorkspace } = useWorkspacesStore();

      if (!activeVariantTab || !activeBlueprint || !activeBucket) {
        return;
      }

      const params = {
        version: 1,
        workspaceId: activeWorkspace.id,
      };

      const payload: IAddEditBucketDTO = {
        value: activeBucket.value,
        blueprintId: activeBlueprint.id,
        variantId: activeVariantTab.variant.id,
      };

      const { data } = await axios.post<IBucketDTO>("v1/buckets", payload, {
        params,
      });

      activeBucket.id = data.id;
      activeBucket.value = cloneDeep(data.value);
      activeBucket.initialValue = cloneDeep(data.value);

      return data;
    },
  },
});
