<template>
  <n-modal
    :show="isVisible"
    segmented
    title="Create account"
    preset="card"
    :bordered="true"
    :closable="!isLoading"
    :close-on-esc="false"
    :mask-closable="false"
    :style="{ width: '700px' }"
    @close="close"
  >
    <n-form>
      <n-row :gutter="10">
        <n-col :span="12">
          <n-form-item
            label="First name"
            :required="true"
            :feedback="getError('firstName')"
            :validation-status="hasError('firstName')"
          >
            <n-input
              v-model:value="firstName"
              type="text"
              placeholder="first name"
            />
          </n-form-item>
        </n-col>

        <n-col :span="12">
          <n-form-item
            label="Last name"
            :required="true"
            :feedback="getError('lastName')"
            :validation-status="hasError('lastName')"
          >
            <n-input
              v-model:value="lastName"
              type="text"
              placeholder="last name"
            />
          </n-form-item>
        </n-col>
      </n-row>

      <n-row :gutter="10">
        <n-col :span="12">
          <n-form-item
            label="Email"
            :required="true"
            :feedback="getError('email')"
            :validation-status="hasError('email')"
          >
            <n-input v-model:value="email" type="text" placeholder="email" />
          </n-form-item>
        </n-col>

        <n-col :span="12">
          <n-form-item
            label="Confirm email"
            :required="true"
            :feedback="getError('confirmEmail')"
            :validation-status="hasError('confirmEmail')"
          >
            <n-input
              v-model:value="confirmEmail"
              type="text"
              placeholder="confirm email"
            />
          </n-form-item>
        </n-col>
      </n-row>

      <n-row>
        <n-col :span="8">
          <n-form-item
            label="Role"
            :required="true"
            :feedback="getError('roleId')"
            :validation-status="hasError('roleId')"
          >
            <asynchronous-select
              :value="roleId"
              :options="roles"
              :loading="isLoadingRoles"
              :consistent-menu-width="false"
              @select="roleId = $event"
              @onBlur="$emit('select-blur')"
              @filter="$emit('select-filter', $event)"
            />
          </n-form-item>
        </n-col>
      </n-row>
    </n-form>

    <template #footer>
      <n-space justify="space-between">
        <n-button @click="close" :disabled="isLoading"> Cancel </n-button>

        <n-button type="success" :loading="isLoading" @click="onSubmit">
          Submit
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import {
  NCol,
  NRow,
  NForm,
  NInput,
  NSpace,
  NModal,
  NButton,
  NFormItem,
} from "naive-ui";
import { ref, toRefs } from "vue";
import { number, object, string, ref as yupRef } from "yup";

import { useUsersStore } from "@/store/users";
import { defineForm } from "@/helpers/defineForm";
import { useGeneralStore } from "@/store/general";

import { ACCOUNT_RULES } from "@shared/constants/rules";
import { defineWatchers } from "@/helpers/defineWatchers";
import type { AddEditUserDto } from "@shared/types/dtos/AddEditUserDto";
import type { PrimitiveSelectOption } from "@/types/PrimitiveSelectOption";
import AsynchronousSelect from "@/components/common/AsynchronousSelect.vue";

const usersStore = useUsersStore();
const generalStore = useGeneralStore();

interface IProps {
  isVisible: boolean;

  isLoadingRoles: boolean;

  roles: PrimitiveSelectOption[];
}

const props = defineProps<IProps>();
const { isVisible, roles } = toRefs(props);

const emits = defineEmits([
  "update:is-visible",
  "select-blur",
  "select-filter",
]);

const isLoading = ref(false);

const defaultUser: AddEditUserDto & { confirmEmail: string } = {
  email: "",
  confirmEmail: "",
  firstName: "",
  lastName: "",
  roleId: 0,
};

const { EMAIL, FIRST_NAME, LAST_NAME } = ACCOUNT_RULES;

const {
  fields,
  getError,
  hasError,
  resetForm,
  setFormData,
  handleSubmit,
  setValidationErrors,
} = defineForm<AddEditUserDto & { confirmEmail: string }>(
  defaultUser,
  object({
    email: string().email().required().max(EMAIL.MAX_LENGTH),
    confirmEmail: string()
      .email()
      .required()
      .oneOf([yupRef("email")]),
    firstName: string().required().min(FIRST_NAME.MIN_LENGTH),
    lastName: string().required().min(LAST_NAME.MIN_LENGTH),
    roleId: number().required(),
  })
);

defineWatchers({
  isVisible: {
    source: isVisible,
    handler(value: boolean) {
      if (!value) {
        return;
      }

      setFormData({
        ...defaultUser,
        roleId: roles.value.length
          ? parseInt(roles.value[0].value.toString())
          : null,
      });
    },
  },
});

const {
  email: { value: email },
  confirmEmail: { value: confirmEmail },
  firstName: { value: firstName },
  lastName: { value: lastName },
  roleId: { value: roleId },
} = fields;

function close() {
  emits("update:is-visible", false);

  setTimeout(() => {
    resetForm();
  }, 200);
}

const onSubmit = handleSubmit.withControlled(async formData => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmEmail, ...payload } = formData;

    await usersStore.store(payload);

    generalStore.messageProvider.success(`Account created!`);

    close();
  } catch (error) {
    console.error(error);

    setValidationErrors(error);

    generalStore.messageProvider.error(`Failed to create account!`);
  } finally {
    isLoading.value = false;
  }
});
</script>
