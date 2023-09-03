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
          label="Note"
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
        <n-space justify="space-between" class="w-100">
          <require-permission :permission="Permission.DeleteBlueprint">
            <n-button secondary type="error"> Delete </n-button>
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
  NColorPicker,
  NDrawerContent,
} from "naive-ui";
import { storeToRefs } from "pinia";
import cloneDeep from "lodash/cloneDeep";
import { computed, ref, watch } from "vue";
import { object, string, Schema } from "yup";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";

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

const canAddOrEditBlueprint = authStore.hasAtLeastOnePermission([
  Permission.CreateBlueprint,
  Permission.UpdateBlueprint,
]);

const schema = toTypedSchema<Schema<AddEditBlueprintDto>>(
  object({
    name: string().required(),
    color: string().required(),
    description: string().required(),
  })
);

const { errors, setValues, meta, handleSubmit } = useForm({
  validationSchema: schema,
});

const { value: name } = useField<string>("name");
const { value: color } = useField<string>("color");
const { value: description } = useField<string>("description");

const { getError, hasError } = useVeeValidateHelpers(meta, errors);

const title = computed(() => {
  return `${blueprintsStore.itemToEdit ? "Edit" : "Add"} blueprint`;
});

const isActive = computed(
  () => drawerStore.isDrawerActive(Drawer.AddEditBlueprint) || false
);
const isEditMode = computed(() => !!blueprintsStore.itemToEdit);

watch(isActive, async () => {
  if (!isActive.value) {
    return;
  }

  setValues(cloneDeep(blueprintsStore.itemToEdit || defaultFormData));
});

watch(itemToEdit, () => {
  setValues(cloneDeep(blueprintsStore.itemToEdit || defaultFormData));
});

const onShowUpdate = () => {
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

    onShowUpdate();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});
</script>
