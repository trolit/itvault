<template>
  <n-form :show-label="false" size="large">
    <n-form-item
      :feedback="getError('email')"
      :validation-status="hasError('email')"
    >
      <n-input v-model:value="email" type="text" placeholder="Login" />
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
import { object, string } from "yup";
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import { NInput, NForm, NFormItem, NButton, useMessage } from "naive-ui";

import { useAuthStore } from "@/store/auth";
import type { ILoginForm } from "@/interfaces/ILoginForm";
import { ROUTE_DASHBOARD_NAME } from "@/assets/constants/routes";
import { useVeeValidateHelpers } from "@/utilities/useVeeValidateHelpers";

const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const { errors, handleSubmit, meta } = useForm({
  validationSchema: object({
    email: string().required().email(),
    password: string().required(),
  }),
});
const { value: email } = useField<string>("email");
const { value: password } = useField<string>("password");
const { getError, hasError } = useVeeValidateHelpers(meta, errors);

const isLoading = ref(false);

const onSubmit = handleSubmit.withControlled(async values => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  try {
    await authStore.login(values as ILoginForm);

    router.push({ name: ROUTE_DASHBOARD_NAME });
  } catch (error) {
    // @TODO handle server errors
    console.error(error);

    // @NOTE consider custom message
    message.warning(
      "Provided credentials are invalid or account does not exist."
    );
  } finally {
    isLoading.value = false;
  }
});
</script>
