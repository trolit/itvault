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

        <div
          v-if="isEditMode && initialFormData.name !== CURRENT_FORM_DATA.name"
        >
          <n-alert type="warning">
            Name is used to provide verbose URL to the user. It is advised to
            not change it unless you have to. In case of change, please inform
            other users so they can update e.g. their bookmarks.
          </n-alert>
        </div>

        <n-form-item
          label="Description"
          :required="false"
          :feedback="getError('description')"
          :validation-status="hasError('description')"
        >
          <n-input
            show-count
            maxlength="255"
            v-model:value="description"
            type="textarea"
            placeholder="Description"
            :resizable="true"
          />
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
  NAlert,
  NFormItem,
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
import { useGeneralStore } from "@/store/general";
import { useWorkspacesStore } from "@/store/workspaces";
import { defineComputed } from "@/helpers/defineComputed";
import { defineWatchers } from "@/helpers/defineWatchers";
import { WORKSPACE_RULES } from "@shared/constants/rules";
import { Permission } from "@shared/types/enums/Permission";
import { defineFormApiRequest } from "@/helpers/defineFormApiRequest";
import type { IAddEditWorkspaceDTO } from "@shared/types/DTOs/Workspace";
import RequirePermission from "@/components/common/RequirePermission.vue";

const tagsStore = useTagsStore();
const drawerStore = useDrawerStore();
const generalStore = useGeneralStore();
const workspacesStore = useWorkspacesStore();

const tagInput = ref("");
const tagSearchTimeoutId = ref(0);
const isLoadingTags = ref(false);
const options: Ref<string[]> = ref([]);
const { itemToEdit } = storeToRefs(workspacesStore);

const defaultFormData: IAddEditWorkspaceDTO = {
  name: "",
  description: "",
  tags: [],
};

const initialFormData: Ref<Partial<IAddEditWorkspaceDTO>> = ref(
  cloneDeep(defaultFormData)
);

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
        JSON.stringify(CURRENT_FORM_DATA)
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

      initialFormData.value = cloneDeep(CURRENT_FORM_DATA);
    },
  },

  itemToEdit: {
    source: itemToEdit,
    handler() {
      resetForm();

      setFormData(cloneDeep(itemToEdit.value || defaultFormData));

      initialFormData.value = cloneDeep(CURRENT_FORM_DATA);
    },
  },
});

const dismissDrawer = () => {
  drawerStore.setActiveDrawer(null);
};

const { NAME, DESCRIPTION, TAGS } = WORKSPACE_RULES;

const {
  vModel: { name, description, tags },
  isLoading,
  getError,
  hasError,
  resetForm,
  setFormData,
  CURRENT_FORM_DATA,
  onSubmit,
} = defineFormApiRequest<IAddEditWorkspaceDTO>({
  data: {
    name: "",
    description: "",
    tags: [],
  },

  schema: object({
    name: string().required().matches(NAME.REGEX),
    description: string().defined().max(DESCRIPTION.MAX_LENGTH),
    tags: array()
      .of(string().matches(TAGS.REGEX).required())
      .required()
      .min(TAGS.MIN_LENGTH),
  }),

  formCallHandler: async (formData, printSuccess) => {
    const isEdit = cloneDeep(isEditMode.value);

    isEdit
      ? await workspacesStore.update(formData)
      : await workspacesStore.add(formData);

    printSuccess(`Workspace successfully ${isEdit ? "updated" : "added"}.`);

    dismissDrawer();
  },

  errorHandler: (error, printError) => {
    printError(`Failed to perform operation.`);
  },
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
        generalStore.messageProvider.info(
          `No tags found with keyword: ${input}`
        );
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
