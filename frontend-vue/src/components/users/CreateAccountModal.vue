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
import { toRefs } from "vue";
import { number, object, string, ref as yupRef } from "yup";

import { useUsersStore } from "@/store/users";

import { ACCOUNT_RULES } from "@shared/constants/rules";
import type { IAddUserDTO } from "@shared/types/DTOs/User";
import { useModalHelpers } from "@/helpers/useModalHelpers";
import type { Emits, Props } from "@/types/CommonModalTypes";
import { defineFormApiRequest } from "@/helpers/defineFormApiRequest";
import type { PrimitiveSelectOption } from "@/types/PrimitiveSelectOption";
import AsynchronousSelect from "@/components/common/AsynchronousSelect.vue";

const props = defineProps<
  Props & {
    isLoadingRoles: boolean;

    roles: PrimitiveSelectOption[];
  }
>();
const emits = defineEmits<
  Emits & {
    (event: "select-blur"): void;

    (event: "select-filter", intput: string): void;
  }
>();

const { roles } = toRefs(props);

const usersStore = useUsersStore();

const { isVisible } = useModalHelpers(props, {
  onShow: () => {
    setFormData({
      ...defaultUser,
      roleId: roles.value.length
        ? parseInt(roles.value[0].value.toString())
        : null,
    });
  },
});

const defaultUser: IAddUserDTO & { confirmEmail: string } = {
  email: "",
  confirmEmail: "",
  firstName: "",
  lastName: "",
  roleId: 0,
};

const { EMAIL, FIRST_NAME, LAST_NAME } = ACCOUNT_RULES;

function close() {
  emits("update:is-visible", false);

  setTimeout(() => {
    resetForm();
  }, 200);
}

const {
  isLoading,
  vModel: { email, confirmEmail, firstName, lastName, roleId },
  getError,
  hasError,
  resetForm,
  setFormData,
  onSubmit,
} = defineFormApiRequest<IAddUserDTO & { confirmEmail: string }>({
  data: defaultUser,

  schema: object({
    email: string().email().required().max(EMAIL.MAX_LENGTH),
    confirmEmail: string()
      .email()
      .required()
      .oneOf([yupRef("email")]),
    firstName: string().required().min(FIRST_NAME.MIN_LENGTH),
    lastName: string().required().min(LAST_NAME.MIN_LENGTH),
    roleId: number().required(),
  }),

  formCallHandler: async (formData, printSuccess) => {
    const { confirmEmail, ...payload } = formData;

    await usersStore.add(payload);

    printSuccess(`Account '${confirmEmail}' created!`);

    close();
  },

  errorHandler: (error, printError) => {
    printError(`Failed to create account!`);
  },
});
</script>
