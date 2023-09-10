<template>
  <n-drawer
    :show="isActive"
    :width="502"
    placement="left"
    :show-mask="false"
    :trap-focus="false"
    :block-scroll="false"
    :mask-closable="false"
    @update:show="dismissDrawer"
  >
    <n-drawer-content :title="title" closable>
      <n-form>
        <n-form-item
          label="Name"
          :required="true"
          :feedback="getError('name')"
          :validation-status="hasError('name')"
        >
          <n-input v-model:value="name" type="text" placeholder="Name" />
        </n-form-item>

        <n-form-item
          label="Tags"
          :required="true"
          :feedback="getError('tags')"
          :validation-status="hasError('tags')"
        >
          <n-dynamic-tags v-model:value="tags" />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="space-between" class="w-100" align="center">
          <require-permission
            :permission="
              isEditMode
                ? Permission.UpdateWorkspace
                : Permission.CreateWorkspace
            "
          >
            <n-button
              secondary
              type="success"
              @click="onSubmit"
              :loading="isLoading"
              :disabled="isInitialState"
            >
              {{ isEditMode ? "Update" : "Create" }}
            </n-button>
          </require-permission>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import {
  NForm,
  NInput,
  NSpace,
  NButton,
  NDrawer,
  NFormItem,
  useMessage,
  NDynamicTags,
  NDrawerContent,
} from "naive-ui";
import { ref, type Ref } from "vue";
import { storeToRefs } from "pinia";
import cloneDeep from "lodash/cloneDeep";
import { array, object, string } from "yup";

import { Drawer } from "@/types/enums/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { defineForm } from "@/helpers/defineForm";
import { useWorkspacesStore } from "@/store/workspaces";
import { defineComputed } from "@/helpers/defineComputed";
import { defineWatchers } from "@/helpers/defineWatchers";
import { Permission } from "@shared/types/enums/Permission";
import RequirePermission from "@/components/common/RequirePermission.vue";
import type { AddEditWorkspaceDto } from "@shared/types/dtos/AddEditWorkspaceDto";

const message = useMessage();
const drawerStore = useDrawerStore();
const workspacesStore = useWorkspacesStore();

const isLoading = ref(false);
const { itemToEdit } = storeToRefs(workspacesStore);

const defaultFormData: AddEditWorkspaceDto = {
  name: "",
  tags: [],
};

const initialFormData: Ref<Partial<AddEditWorkspaceDto>> = ref(
  cloneDeep(defaultFormData)
);

const {
  fields,
  getError,
  hasError,
  resetForm,
  setFormData,
  handleSubmit,
  currentFormData,
} = defineForm<AddEditWorkspaceDto>(
  defaultFormData,
  object({
    name: string().required(),
    tags: array().of(string().required()).required().min(1),
  })
);

const {
  name: { value: name },
  tags: { value: tags },
} = fields;

const { isActive, title, isEditMode, isInitialState } = defineComputed({
  isActive() {
    return drawerStore.isDrawerActive(Drawer.AddEditWorkspace) || false;
  },

  isEditMode() {
    return !!workspacesStore.itemToEdit;
  },

  title(): string {
    return `${isEditMode.value ? "Edit" : "Add"} workspace`;
  },

  isInitialState() {
    return (
      JSON.stringify(initialFormData.value) === JSON.stringify(currentFormData)
    );
  },
});

defineWatchers({
  isActive: {
    source: isActive,
    handler(value: boolean) {
      if (!value) {
        return;
      }

      resetForm();

      setFormData(cloneDeep(itemToEdit.value || defaultFormData));

      initialFormData.value = cloneDeep(currentFormData);
    },
  },

  itemToEdit: {
    source: itemToEdit,
    handler() {
      resetForm();

      setFormData(cloneDeep(itemToEdit.value || defaultFormData));

      initialFormData.value = cloneDeep(currentFormData);
    },
  },
});

const dismissDrawer = () => {
  drawerStore.setActiveDrawer(null);
};

const onSubmit = handleSubmit.withControlled(async formData => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  const isEdit = cloneDeep(isEditMode.value);

  try {
    isEdit
      ? await workspacesStore.update(formData)
      : await workspacesStore.store(formData);

    if (!isEdit) {
      workspacesStore.getAll({
        page: 1,
        perPage: workspacesStore.ITEMS_PER_PAGE,
      });
    }

    message.success(`Workspace successfully ${isEdit ? "updated" : "added"}.`);

    dismissDrawer();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});
</script>
