<template>
  <n-form :show-label="false">
    <n-form-item path="inputValue">
      <n-input
        v-model:value="formData.email"
        type="text"
        size="large"
        placeholder="Login"
      />
    </n-form-item>

    <n-form-item path="inputValue">
      <n-input
        v-model:value="formData.password"
        size="large"
        :maxlength="8"
        type="password"
        placeholder="Password"
        show-password-on="mousedown"
      />
    </n-form-item>

    <div class="actions">
      <n-button text :bordered="false" type="tertiary" @click="login">
        Sign in
      </n-button>
    </div>
  </n-form>
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import { NInput, NForm, NFormItem, NButton } from "naive-ui";

import { useAuthStore } from "@/stores/auth";
import type { ILoginForm } from "@/interfaces/ILoginForm";

const authStore = useAuthStore();

const formData: Ref<ILoginForm> = ref({ email: "", password: "" });

async function login() {
  try {
    await authStore.login(formData.value);
  } catch (error) {
    console.error(error);
  }
}
</script>
