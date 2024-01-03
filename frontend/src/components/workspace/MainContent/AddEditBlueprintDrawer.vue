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
    @update:show="dismissDrawer"
  >
    <n-drawer-content :title="title" closable>
      <n-form
        size="large"
        :disabled="
          !authStore.hasAtLeastOnePermission([
            Permission.CreateBlueprint,
            Permission.UpdateBlueprint,
          ])
        "
      >
        <n-form-item
          label="Name"
          :required="true"
          :feedback="getError('name')"
          :validation-status="hasError('name')"
        >
          <n-input v-model:value="name" type="text" placeholder="Name" />
        </n-form-item>

        <n-form-item
          label="Description"
          :required="true"
          :feedback="getError('description')"
          :validation-status="hasError('description')"
        >
          <n-input
            v-model:value="description"
            type="textarea"
            placeholder="Description"
            :resizable="true"
          />
        </n-form-item>

        <n-form-item
          label="Color"
          :required="true"
          :feedback="getError('color')"
          :validation-status="hasError('color')"
        >
          <n-color-picker
            v-model:value="color"
            :show-alpha="false"
            :modes="['hex']"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="space-between" class="w-100" align="center">
          <require-permission
            v-if="isEditMode"
            :permission="Permission.DeleteBlueprint"
          >
            <n-popconfirm @positive-click="deleteBlueprint">
              <template #trigger>
                <n-button secondary type="error" :loading="isLoading">
                  Delete
                </n-button>
              </template>

              Are you sure that you want to remove this blueprint? Bundles with
              that blueprint will persist but users won't be able to discover
              blueprint usage in files.
            </n-popconfirm>
          </require-permission>

          <require-permission
            :permission="
              isEditMode
                ? Permission.UpdateBlueprint
                : Permission.CreateBlueprint
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
  NPopconfirm,
  NColorPicker,
  NDrawerContent,
} from "naive-ui";
import { ref, type Ref } from "vue";
import { storeToRefs } from "pinia";
import { object, string } from "yup";
import cloneDeep from "lodash/cloneDeep";

import { useAuthStore } from "@/store/auth";
import { Drawer } from "@/types/enums/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { defineForm } from "@/helpers/defineForm";
import { useGeneralStore } from "@/store/general";
import { useBlueprintsStore } from "@/store/blueprints";
import { BLUEPRINT_RULES } from "@shared/constants/rules";
import { defineComputed } from "@/helpers/defineComputed";
import { defineWatchers } from "@/helpers/defineWatchers";
import { Permission } from "@shared/types/enums/Permission";
import type { IAddEditBlueprintDTO } from "@shared/types/DTOs/Blueprint";
import RequirePermission from "@/components/common/RequirePermission.vue";

const authStore = useAuthStore();
const drawerStore = useDrawerStore();
const generalStore = useGeneralStore();
const blueprintsStore = useBlueprintsStore();

const isLoading = ref(false);
const { itemToEdit } = storeToRefs(blueprintsStore);

const defaultFormData: IAddEditBlueprintDTO = {
  name: "",
  color: "#D0A056",
  description: "",
};

const initialFormData: Ref<Partial<IAddEditBlueprintDTO>> = ref(
  cloneDeep(defaultFormData)
);

const { DESCRIPTION, COLOR } = BLUEPRINT_RULES;

const {
  fields,
  getError,
  hasError,
  resetForm,
  setFormData,
  handleSubmit,
  currentFormData,
  setValidationErrors,
} = defineForm<IAddEditBlueprintDTO>(
  defaultFormData,
  object({
    name: string().required(),
    color: string().required().matches(COLOR.REGEX),
    description: string().required().min(DESCRIPTION.MIN_LENGTH),
  })
);

const {
  name: { value: name },
  color: { value: color },
  description: { value: description },
} = fields;

const { isActive, title, isEditMode, isInitialState } = defineComputed({
  isActive() {
    return drawerStore.isDrawerActive(Drawer.AddEditBlueprint) || false;
  },

  isEditMode() {
    return !!blueprintsStore.itemToEdit;
  },

  title(): string {
    return `${isEditMode.value ? "Edit" : "Add"} blueprint`;
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
      ? await blueprintsStore.update(formData)
      : await blueprintsStore.add(formData);

    if (!isEdit) {
      blueprintsStore.getAll({
        page: 1,
        perPage: blueprintsStore.ITEMS_PER_PAGE,
      });
    }

    generalStore.messageProvider.success(
      `Blueprint successfully ${isEdit ? "updated" : "added"}.`
    );

    dismissDrawer();
  } catch (error) {
    console.error(error);

    setValidationErrors(error);
  } finally {
    isLoading.value = false;
  }
});

async function deleteBlueprint() {
  if (!itemToEdit.value) {
    return;
  }

  isLoading.value = true;

  try {
    await blueprintsStore.delete(itemToEdit.value.id);

    itemToEdit.value = null;

    generalStore.messageProvider.success(`Blueprint removed.`);

    dismissDrawer();
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
