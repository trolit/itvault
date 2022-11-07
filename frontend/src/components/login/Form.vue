<template>
  <n-form :show-label="false" size="large">
    <n-form-item
      :feedback="getError(errors.email)"
      :validation-status="hasError(errors.email)"
    >
      <n-input v-model:value="email" type="text" placeholder="Login" />
    </n-form-item>

    <n-form-item
      :feedback="getError(errors.password)"
      :validation-status="hasError(errors.password)"
    >
      <n-input
        v-model:value="password"
        :maxlength="100"
        type="password"
        placeholder="Password"
        show-password-on="mousedown"
      />
    </n-form-item>

    <div class="actions">
      <n-button
        secondary
        type="tertiary"
        :loading="isLoading"
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
import { useForm, useField } from "vee-validate";
import { NInput, NForm, NFormItem, NButton } from "naive-ui";

import { useAuthStore } from "@/stores/auth";
import type { ILoginForm } from "@/interfaces/ILoginForm";

const authStore = useAuthStore();

const schema = object({
  email: string().required().email(),
  password: string().required(),
});

const { errors, handleSubmit, meta } = useForm({
  validationSchema: schema,
});

let { value: isLoading } = ref(false);

const onSubmit = handleSubmit.withControlled(async values => {
  if (isLoading) {
    return;
  }

  isLoading = true;

  try {
    await authStore.login(values as ILoginForm);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading = false;
  }
});

const { value: email } = useField<string>("email");

const { value: password } = useField<string>("password");

function hasError(value: string | undefined) {
  return value && meta.value.touched ? "error" : undefined;
}

function getError(value: string | undefined) {
  return meta.value.touched ? value : undefined;
}
</script>
