<template>
  <div>
    <n-h2>Your profile</n-h2>

    <n-form class="profile-form" label-placement="left">
      <n-form-item
        label="First name"
        :required="true"
        :feedback="getError('firstName')"
        :validation-status="hasError('firstName')"
      >
        <n-input
          v-model:value="firstName"
          type="text"
          placeholder="First name"
        />
      </n-form-item>

      <n-form-item
        label="Last name"
        :required="true"
        :feedback="getError('lastName')"
        :validation-status="hasError('lastName')"
      >
        <n-input
          v-model:value="lastName"
          type="text"
          placeholder="First name"
        />
      </n-form-item>
    </n-form>

    <n-button
      secondary
      type="success"
      @click="onSubmit"
      :loading="isLoading"
      :disabled="isInitialState"
    >
      Save
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { object, string } from "yup";
import { NForm, NFormItem, NInput, NH2, NButton } from "naive-ui";

import { useAuthStore } from "@/store/auth";
import { useUsersStore } from "@/store/users";
import { ACCOUNT_RULES } from "@shared/constants/rules";
import type { IUpdateProfileDTO } from "@shared/types/DTOs/User";
import { defineFormApiRequest } from "@/helpers/defineFormApiRequest";

const authStore = useAuthStore();
const usersStore = useUsersStore();

const { profile } = authStore;
const { FIRST_NAME, LAST_NAME } = ACCOUNT_RULES;

const {
  vModel: { firstName, lastName },
  isLoading,
  getError,
  hasError,
  CURRENT_FORM_DATA,
  onSubmit,
} = defineFormApiRequest<IUpdateProfileDTO>({
  data: {
    firstName: profile.firstName,
    lastName: profile.lastName,
  },

  schema: object({
    firstName: string()
      .required()
      .min(FIRST_NAME.MIN_LENGTH)
      .max(FIRST_NAME.MAX_LENGTH),
    lastName: string()
      .required()
      .min(LAST_NAME.MIN_LENGTH)
      .max(LAST_NAME.MAX_LENGTH),
  }),

  formCallHandler: async (formData, printSuccess) => {
    await usersStore.updateProfile(formData);

    authStore.updateProfile(formData);

    printSuccess(`Profile updated`);
  },

  errorHandler: (error, printError) => {
    printError(`Failed to update profile!`);
  },
});

const isInitialState = computed(() => {
  const { profile } = authStore;

  return (
    profile.firstName === CURRENT_FORM_DATA.firstName &&
    profile.lastName === CURRENT_FORM_DATA.lastName
  );
});
</script>
