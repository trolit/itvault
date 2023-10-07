<template>
  <n-drawer
    :show="isActive"
    :width="450"
    placement="right"
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

      <n-auto-complete
        blur-after-select
        :value="tagInput"
        placeholder="type to find suggestions"
        :options="filteredOptions"
        :loading="isLoadingTags"
        :disabled="isLoadingTags"
        @select="onTagSelect"
        @update:value="onTagInputChange"
      />

      <template #footer>
        <n-space justify="center" class="w-100" align="center">
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
  NAutoComplete,
  NDrawerContent,
} from "naive-ui";
import { ref, type Ref } from "vue";
import { storeToRefs } from "pinia";
import cloneDeep from "lodash/cloneDeep";
import { array, object, string } from "yup";

import { useTagsStore } from "@/store/tags";
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
const tagsStore = useTagsStore();
const drawerStore = useDrawerStore();
const workspacesStore = useWorkspacesStore();

const tagInput = ref("");
const isLoading = ref(false);
const tagSearchTimeoutId = ref(0);
const isLoadingTags = ref(false);
const options: Ref<string[]> = ref([]);
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
  setValidationErrors,
} = defineForm<AddEditWorkspaceDto>(
  defaultFormData,
  object({
    name: string().required(),
    tags: array()
      .of(
        string()
          .matches(/^[a-zA-Z0-9]*$/)
          .required()
      )
      .required()
      .min(1),
  })
);

const {
  name: { value: name },
  tags: { value: tags },
} = fields;

const { isActive, title, isEditMode, isInitialState, filteredOptions } =
  defineComputed({
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
        JSON.stringify(initialFormData.value) ===
        JSON.stringify(currentFormData)
      );
    },

    filteredOptions() {
      return options.value.filter(tag => !tags.value.includes(tag));
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

    setValidationErrors(error);
  } finally {
    isLoading.value = false;
  }
});

function onTagInputChange(input: string) {
  if (options.value.includes(input)) {
    return;
  }

  tagInput.value = input;

  if (!input) {
    return;
  }

  if (tagSearchTimeoutId.value) {
    clearTimeout(tagSearchTimeoutId.value);
  }

  tagSearchTimeoutId.value = setTimeout(async () => {
    options.value = [];

    isLoadingTags.value = true;

    try {
      const { data } = await tagsStore.getBySearch(input);

      options.value = data.total ? data.result.map(item => item.value) : [];

      if (!data.total) {
        message.info(`No tags found with keyword: ${input}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      isLoadingTags.value = false;
    }
  }, 250);
}

function onTagSelect(tag: string | number) {
  if (typeof tag !== "string") {
    return;
  }

  if (tags.value.includes(tag)) {
    return;
  }

  tags.value.push(tag);
}
</script>
