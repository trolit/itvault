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
        size="large"
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
import { useForm, useField } from "vee-validate";
import { object, string, type SchemaOf } from "yup";
import { NInput, NForm, NFormItem, NButton } from "naive-ui";

import { useAuthStore } from "@/stores/auth";
import type { ILoginForm } from "@/interfaces/ILoginForm";

const authStore = useAuthStore();

const schema: SchemaOf<ILoginForm> = object({
  email: string().required().email(),
  password: string().required(),
});

const { errors, handleSubmit, meta } = useForm({
  validationSchema: schema,
});

const { value: email } = useField<string>("email");

const { value: password } = useField<string>("password");

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

function hasError(value: string | undefined) {
  return value && meta.value.touched ? "error" : undefined;
}

function getError(value: string | undefined) {
  return meta.value.touched ? value : undefined;
}
</script>
