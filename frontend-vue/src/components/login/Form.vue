<template>
  <n-form :show-label="false" size="large">
    <n-form-item
      :feedback="getError('email')"
      :validation-status="hasError('email')"
    >
      <n-input
        v-model:value="email"
        type="text"
        placeholder="Login"
        data-cy="email-input"
      />
    </n-form-item>

    <n-form-item
      :feedback="getError('password')"
      :validation-status="hasError('password')"
    >
      <n-input
        v-model:value="password"
        :maxlength="100"
        type="password"
        placeholder="Password"
        show-password-on="mousedown"
        data-cy="password-input"
      />
    </n-form-item>

    <div class="actions">
      <n-button
        secondary
        size="large"
        type="tertiary"
        :loading="isLoading"
        data-cy="submit-button"
        @click="onSubmit"
      >
        Sign in
      </n-button>
    </div>
  </n-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { object, string } from "yup";
import { useRouter } from "vue-router";
import { NInput, NForm, NFormItem, NButton } from "naive-ui";

import { useAuthStore } from "@/store/auth";
import { defineForm } from "@/helpers/defineForm";
import type { ISignInDTO } from "@shared/types/DTOs/Auth";
import { ROUTE_DASHBOARD_NAME } from "@/assets/constants/routes";

const router = useRouter();
const authStore = useAuthStore();

const defaultFormData: ISignInDTO = {
  email: "",
  password: "",
};

const isLoading = ref(false);

const { fields, getError, hasError, handleSubmit, setValidationErrors } =
  defineForm<ISignInDTO>(
    defaultFormData,
    object({
      email: string().email().required(),
      password: string().required().min(4),
    })
  );

const {
  email: { value: email },
  password: { value: password },
} = fields;

const onSubmit = handleSubmit.withControlled(async formData => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  try {
    await authStore.login(formData);

    router.push({ name: ROUTE_DASHBOARD_NAME });
  } catch (error) {
    console.error(error);

    setValidationErrors(error);
  } finally {
    isLoading.value = false;
  }
});
</script>
