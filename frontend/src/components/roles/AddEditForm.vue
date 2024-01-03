<template>
  <loading-section v-if="isLoadingPermissions" />

  <empty
    v-else-if="!roleTab.currentForm.permissions.length"
    title="Permissions not found."
  />

  <div class="wrapper" v-else>
    <n-form :disabled="isLoading">
      <n-form-item
        required
        label="Name"
        :feedback="getError('name')"
        :validation-status="hasError('name')"
      >
        <n-input v-model:value="name" type="text" placeholder="name" />
      </n-form-item>

      <n-form-item
        label="Description"
        :feedback="getError('description')"
        :validation-status="hasError('description')"
      >
        <n-input
          clearable
          show-count
          :autosize="{
            minRows: 1,
          }"
          maxlength="50"
          v-model:value="description"
          type="textarea"
          placeholder="Short role description"
        />
      </n-form-item>

      <n-form-item
        v-if="groupedPermissions"
        label="Permissions"
        :feedback="getError('permissions')"
        :validation-status="hasError('permissions')"
      >
        <div>
          <n-grid
            :cols="4"
            v-for="(permissions, index) in groupedPermissions"
            :key="`group-${index}`"
          >
            <n-grid-item class="group" :span="1">
              <span>
                {{ permissions[0].group }}
              </span>
            </n-grid-item>

            <n-grid-item class="permissions" :span="3">
              <n-grid :y-gap="10" :cols="2">
                <n-grid-item
                  v-for="(permission, index) in permissions"
                  :key="`permission-${index}`"
                >
                  <n-checkbox
                    size="small"
                    :label="permission.name"
                    v-model:checked="permission.enabled"
                  />
                </n-grid-item>
              </n-grid>
            </n-grid-item>
          </n-grid>
        </div>
      </n-form-item>
    </n-form>

    <n-space justify="space-evenly">
      <n-popconfirm @positive-click="reset">
        <template #trigger>
          <n-button
            secondary
            type="warning"
            :disabled="isInitialState || isLoading"
          >
            Reset
          </n-button>
        </template>

        Are you sure?
      </n-popconfirm>

      <n-popconfirm @positive-click="onSubmit">
        <template #trigger>
          <n-button
            secondary
            type="success"
            :loading="isLoading"
            :disabled="isInitialState"
          >
            {{ isNewRole ? "Create" : "Update" }}
          </n-button>
        </template>

        Are you sure?
      </n-popconfirm>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import {
  NForm,
  NGrid,
  NInput,
  NSpace,
  NButton,
  NCheckbox,
  NGridItem,
  NFormItem,
  NPopconfirm,
} from "naive-ui";
import orderBy from "lodash/orderBy";
import cloneDeep from "lodash/cloneDeep";
import { array, object, string } from "yup";
import { onBeforeMount, ref, type PropType, toRefs } from "vue";

import { useRolesStore } from "@/store/roles";
import Empty from "@/components/common/Empty.vue";
import { defineForm } from "@/helpers/defineForm";
import { useGeneralStore } from "@/store/general";
import type { Form, RoleTab } from "@/types/RoleTab";
import { defineComputed } from "@/helpers/defineComputed";
import { defineWatchers } from "@/helpers/defineWatchers";
import { usePermissionsStore } from "@/store/permissions";
import type { IAddEditRoleDTO } from "@shared/types/DTOs/Role";
import type { IRolePermissionDTO } from "@shared/types/DTOs/Role";
import LoadingSection from "@/components/common/LoadingSection.vue";

const rolesStore = useRolesStore();
const generalStore = useGeneralStore();
const permissionsStore = usePermissionsStore();

const props = defineProps({
  roleTab: {
    type: Object as PropType<RoleTab>,
    required: true,
  },
});

const emits = defineEmits(["create-role", "update-role"]);

const { roleTab } = toRefs(props);

const isLoading = ref(false);
const isLoadingPermissions = ref(false);

const {
  fields,
  getError,
  hasError,
  resetForm,
  handleSubmit,
  setFormData,
  currentFormData,
  setValidationErrors,
} = defineForm<Form>(
  { name: "", description: "", permissions: [] },
  object({
    name: string().required(),
    description: string().required().max(50),
    permissions: array().required(),
  })
);

onBeforeMount(async () => {
  const { currentForm } = roleTab.value;

  if (!currentForm.permissions.length) {
    await getPermissions();
  }

  setFormData(cloneDeep(currentForm));
});

const {
  name: { value: name },
  description: { value: description },
  permissions: { value: permissions },
} = fields;

const { isNewRole, isInitialState, groupedPermissions } = defineComputed({
  isNewRole() {
    return roleTab.value.roleId === 0;
  },

  isInitialState() {
    return (
      JSON.stringify(roleTab.value.initialForm) ===
      JSON.stringify(currentFormData)
    );
  },

  groupedPermissions() {
    if (!permissions.value) {
      return [];
    }

    const groups = [
      ...new Set(permissions.value.map(({ group }) => group)),
    ].sort();

    return groups.map(group => {
      const data = permissions.value.filter(
        permission => permission.group === group
      );

      return orderBy(data, element => element.name, ["asc"]);
    });
  },
});

defineWatchers({
  name: {
    source: name,
    handler: (value: string) => {
      rolesStore.updateTabCurrentFormName(roleTab.value.roleId, value);
    },
  },

  description: {
    source: description,
    handler: (value: string) => {
      rolesStore.updateTabCurrentFormDescription(roleTab.value.roleId, value);
    },
  },

  permissions: {
    source: permissions,
    handler: (value: IRolePermissionDTO[]) => {
      rolesStore.updateTabCurrentFormPermissions(roleTab.value.roleId, value);
    },
    options: {
      deep: true,
    },
  },
});

async function getPermissions() {
  isLoadingPermissions.value = true;

  const { roleId } = roleTab.value;

  try {
    const data =
      roleId === 0
        ? await permissionsStore.getAll()
        : await rolesStore.getPermissionsById(roleId);

    rolesStore.setTabPermissions(roleId, data);
  } catch (error) {
    console.log(error);
  } finally {
    isLoadingPermissions.value = false;
  }
}

function reset() {
  resetForm();

  setFormData(cloneDeep(roleTab.value.initialForm));
}

const onSubmit = handleSubmit.withControlled(async formData => {
  isLoading.value = true;

  let roleId = rolesStore.activeRoleId;
  const isEdit = roleId !== 0;

  const payload: IAddEditRoleDTO = {
    name: formData.name,
    description: formData.description,
    permissions: formData.permissions.map(({ signature, enabled }) => ({
      signature,
      enabled,
    })),
  };

  try {
    if (isEdit) {
      await rolesStore.update(roleId, payload);
    } else {
      const result = await rolesStore.add(payload);

      roleId = result.id;
    }

    generalStore.messageProvider.success(
      `Role successfully ${isEdit ? "updated" : "added"}.`
    );

    isEdit
      ? emits("update-role", roleId, payload)
      : emits("create-role", roleId);
  } catch (error) {
    console.error(error);

    generalStore.messageProvider.success(
      `Failed to ${isEdit ? "update" : "add"} role.`
    );

    setValidationErrors(error);
  } finally {
    isLoading.value = false;
  }
});
</script>
