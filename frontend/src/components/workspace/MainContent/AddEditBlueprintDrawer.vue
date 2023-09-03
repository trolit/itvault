<template>
  <n-drawer
    :show="isActive"
    :width="502"
    placement="right"
    to="#main-content"
    :show-mask="false"
    :trap-focus="false"
    :block-scroll="false"
    :mask-closable="false"
    @update:show="onShowUpdate"
  >
    <n-drawer-content :title="title" closable>
      <n-form size="large">
        <n-form-item label="Name">
          <n-input
            v-model:value="formData.name"
            type="text"
            placeholder="Name"
          />
        </n-form-item>

        <n-form-item label="Note">
          <n-input
            v-model:value="formData.description"
            type="textarea"
            placeholder="Description"
            :resizable="true"
          />
        </n-form-item>

        <n-form-item label="Color">
          <n-color-picker
            v-model:value="formData.color"
            :show-alpha="false"
            :modes="['hex']"
          />
        </n-form-item>
      </n-form>

      <div class="actions">
        <n-button secondary size="large" type="error"> Delete </n-button>

        <n-button secondary size="large" type="success"> Save </n-button>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import {
  NForm,
  NInput,
  NButton,
  NDrawer,
  NFormItem,
  NColorPicker,
  NDrawerContent,
} from "naive-ui";
import { storeToRefs } from "pinia";
import cloneDeep from "lodash/cloneDeep";
import { computed, ref, watch, type Ref } from "vue";

import { Drawer } from "@/types/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { useBlueprintsStore } from "@/store/blueprints";
import type { AddEditBlueprintDto } from "@shared/types/dtos/AddEditBlueprintDto";

const drawerStore = useDrawerStore();
const blueprintsStore = useBlueprintsStore();

const defaultFormData: AddEditBlueprintDto = {
  name: "",
  color: "#D0A056",
  description: "",
};

const formData: Ref<AddEditBlueprintDto> = ref(cloneDeep(defaultFormData));

const { itemToEdit } = storeToRefs(blueprintsStore);

const title = computed(() => {
  return `${blueprintsStore.itemToEdit ? "Edit" : "Add"} blueprint`;
});

const isActive = computed((): boolean => {
  return drawerStore.isDrawerActive(Drawer.AddEditBlueprint) || false;
});

watch(isActive, async () => {
  if (!isActive.value) {
    return;
  }

  formData.value = cloneDeep(blueprintsStore.itemToEdit || defaultFormData);
});

watch(itemToEdit, () => {
  formData.value = cloneDeep(blueprintsStore.itemToEdit || defaultFormData);
});

const onShowUpdate = () => {
  drawerStore.setActiveDrawer(null);
};
</script>
