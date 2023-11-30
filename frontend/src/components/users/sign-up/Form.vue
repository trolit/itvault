<template>
  <div class="form-wrapper">
    <n-form>
      <n-form-item label="Your refID">
        <n-input
          readonly
          :value="id"
          type="password"
          show-password-on="mousedown"
        />
      </n-form-item>

      <n-form-item label="Your code">
        <n-input
          readonly
          :value="code"
          type="password"
          show-password-on="mousedown"
        />
      </n-form-item>

      <n-form-item label="Password">
        <n-input
          type="password"
          show-password-on="mousedown"
          placeholder="password"
        />
      </n-form-item>

      <n-form-item label="Confirm password">
        <n-input
          type="password"
          show-password-on="mousedown"
          placeholder="confirm password"
        />
      </n-form-item>
    </n-form>

    <n-divider />

    <div class="warning">
      <n-text :depth="3">
        <small>
          Before submitting form, please make sure that you are using the link
          that was provided at email address! If some data (except password)
          won't match the ones that were generated for your account, it will be
          blocked!!
        </small>
      </n-text>
    </div>

    <n-space justify="center">
      <n-button type="success">Sign up</n-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import {
  NText,
  NForm,
  NInput,
  NSpace,
  NButton,
  NDivider,
  NFormItem,
} from "naive-ui";

interface IProps {
  id: string;

  email: string;

  code: string;
}

defineProps<IProps>();
</script>
