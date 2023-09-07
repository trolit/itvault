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
      <n-form size="large" :disabled="!canAddOrEditBlueprint">
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
  useMessage,
  NPopconfirm,
  NColorPicker,
  NDrawerContent,
} from "naive-ui";
import { storeToRefs } from "pinia";
import cloneDeep from "lodash/cloneDeep";
import { object, string, Schema } from "yup";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import { computed, ref, watch, type Ref } from "vue";

import { Drawer } from "@/types/Drawer";
import { useAuthStore } from "@/store/auth";
import { useDrawerStore } from "@/store/drawer";
import { useBlueprintsStore } from "@/store/blueprints";
import { Permission } from "@shared/types/enums/Permission";
import RequirePermission from "@/components/common/RequirePermission.vue";
import { useVeeValidateHelpers } from "@/utilities/useVeeValidateHelpers";
import type { AddEditBlueprintDto } from "@shared/types/dtos/AddEditBlueprintDto";

const message = useMessage();
const authStore = useAuthStore();
const drawerStore = useDrawerStore();
const blueprintsStore = useBlueprintsStore();

const isLoading = ref(false);
const { itemToEdit } = storeToRefs(blueprintsStore);

const defaultFormData: AddEditBlueprintDto = {
  name: "",
  color: "#D0A056",
  description: "",
};

const initialFormData: Ref<Partial<AddEditBlueprintDto>> = ref(
  cloneDeep(defaultFormData)
);

const canAddOrEditBlueprint = authStore.hasAtLeastOnePermission([
  Permission.CreateBlueprint,
  Permission.UpdateBlueprint,
]);

// @TODO consider name & description limits
const schema = toTypedSchema<Schema<AddEditBlueprintDto>>(
  object({
    name: string().required(),
    color: string().required(),
    description: string().required(),
  })
);

const {
  errors,
  setValues,
  meta,
  handleSubmit,
  values: currentFormData,
} = useForm({
  validationSchema: schema,
});

const { value: name } = useField<string>("name");
const { value: color } = useField<string>("color");
const { value: description } = useField<string>("description");

const { getError, hasError } = useVeeValidateHelpers(meta, errors);

const isActive = computed(
  () => drawerStore.isDrawerActive(Drawer.AddEditBlueprint) || false
);
const isEditMode = computed(() => !!blueprintsStore.itemToEdit);
const title = computed(() => {
  return `${isEditMode.value ? "Edit" : "Add"} blueprint`;
});
const isInitialState = computed(
  () =>
    JSON.stringify(initialFormData.value) === JSON.stringify(currentFormData)
);

watch(isActive, async () => {
  if (!isActive.value) {
    return;
  }

  setValues(cloneDeep(itemToEdit.value || defaultFormData));

  initialFormData.value = cloneDeep(currentFormData);
});

watch(itemToEdit, () => {
  setValues(cloneDeep(itemToEdit.value || defaultFormData));

  initialFormData.value = cloneDeep(currentFormData);
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
      : await blueprintsStore.store(formData);

    if (!isEdit) {
      blueprintsStore.getAll({
        page: 1,
        perPage: blueprintsStore.BLUEPRINTS_TAB_ITEMS_PER_PAGE,
      });
    }

    message.success(`Blueprint successfully ${isEdit ? "updated" : "added"}.`);

    dismissDrawer();
  } catch (error) {
    console.error(error);
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

    dismissDrawer();
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
