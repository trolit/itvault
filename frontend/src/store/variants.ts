import axios from "axios";
import { defineStore } from "pinia";

import { useFilesStore } from "./files";
import { useWorkspacesStore } from "./workspaces";
import type { IVariantDto } from "@shared/types/dtos/IVariantDto";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";

interface IState {}

export const useVariantsStore = defineStore("variants", {
  state: (): IState => ({}),

  actions: {
    async getBlueprints() {
      const filesStore = useFilesStore();
      const workspaceStore = useWorkspacesStore();

      const variantTab = filesStore.getActiveVariantTab();

      if (!variantTab) {
        return;
      }

      const {
        value: { id },
      } = variantTab;

      const params = {
        version: 1,
        workspaceId: workspaceStore?.activeItem?.id,
      };

      const { data } = await axios.get<IBlueprintDto[]>(
        `v1/variants/${id}/blueprints`,
        {
          params,
        }
      );

      variantTab.blueprints = data;

      return data;
    },

    async getAll() {
      const filesStore = useFilesStore();
      const workspacesStore = useWorkspacesStore();

      const tab = filesStore.getActiveTab();

      if (!tab || tab.variants.length) {
        return;
      }

      const params = {
        version: 1,
        fileId: tab?.file?.id,
        workspaceId: workspacesStore?.activeItem?.id,
      };

      const { data } = await axios.get<IVariantDto[]>("v1/variants", {
        params,
      });

      tab.variants = data.map(variant => ({
        value: variant,
        content: "",
        blueprints: [],
        isVisible: false,
      }));

      return data;
    },

    setActiveTab(id: string) {
      const filesStore = useFilesStore();

      const tab = filesStore.getActiveTab();

      if (!tab) {
        return;
      }

      const variantTab = tab.variants.find(variant => variant.value.id === id);

      if (variantTab) {
        tab.activeVariantId = id;
        variantTab.isVisible = false;
      }
    },

    closeTab(id: string) {
      const filesStore = useFilesStore();

      const tab = filesStore.getActiveTab();

      if (!tab) {
        return;
      }

      const variantTab = tab.variants.find(variant => variant.value.id === id);

      if (!variantTab) {
        return;
      }

      if (tab.activeVariantId === id) {
        tab.activeVariantId = "";
      }

      variantTab.isVisible = false;
    },

    async getContentById(id: string) {
      const filesStore = useFilesStore();
      const workspacesStore = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId: workspacesStore?.activeItem?.id,
      };

      const { data } = await axios.get<string>(`v1/variants/${id}/content`, {
        params,
      });

      const variant = filesStore.getActiveVariantTab();

      if (!variant) {
        return "";
      }

      variant.content = data;

      return data;
    },
  },
});
