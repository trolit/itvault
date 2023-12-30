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

      <n-form-item
        label="Password"
        :feedback="getError('password')"
        :validation-status="hasError('password')"
      >
        <n-input
          v-model:value="password"
          type="password"
          show-password-on="mousedown"
          placeholder="password"
        />
      </n-form-item>

      <n-form-item
        label="Confirm password"
        :feedback="getError('confirmPassword')"
        :validation-status="hasError('confirmPassword')"
      >
        <n-input
          v-model:value="confirmPassword"
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
      <n-button type="success" :loading="isLoading" @click="onSubmit">
        Sign up
      </n-button>
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
import { ref } from "vue";
import { object, string, ref as yupRef } from "yup";

import { useRouter } from "vue-router";
import { useUsersStore } from "@/store/users";
import { defineForm } from "@/helpers/defineForm";
import { useGeneralStore } from "@/store/general";
import { ACCOUNT_RULES } from "@shared/constants/rules";
import { ROUTE_LOGIN_NAME } from "@/assets/constants/routes";

const router = useRouter();
const usersStore = useUsersStore();
const generalStore = useGeneralStore();

interface IProps {
  id: string;

  email: string;

  code: string;
}

const props = defineProps<IProps>();

const isLoading = ref(false);

type SignUpForm = {
  password: string;

  confirmPassword: string;
};

const { PASSWORD } = ACCOUNT_RULES;

const { fields, getError, hasError, handleSubmit, setValidationErrors } =
  defineForm<SignUpForm>(
    {
      password: "",
      confirmPassword: "",
    },
    object({
      password: string()
        .required()
        .min(PASSWORD.MIN_LENGTH)
        .matches(PASSWORD.ONE_LOWERCASE_LETTER_REGEX)
        .matches(PASSWORD.ONE_UPPERCASE_LETTER_REGEX)
        .matches(PASSWORD.ONE_SPECIAL_CHARACTER_REGEX)
        .matches(PASSWORD.ONE_DIGIT_LETTER_REGEX),
      confirmPassword: string()
        .required()
        .oneOf([yupRef("password")]),
    })
  );

const {
  password: { value: password },
  confirmPassword: { value: confirmPassword },
} = fields;

const onSubmit = handleSubmit.withControlled(async formData => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  try {
    await usersStore.signUp({
      id: parseInt(props.id),
      email: props.email,
      signUpCode: props.code,
      password: formData.password,
    });

    generalStore.messageProvider.success(
      "Sign up request processed by application."
    );

    router.push({ name: ROUTE_LOGIN_NAME });
  } catch (error) {
    console.error(error);

    setValidationErrors(error);
  } finally {
    isLoading.value = false;
  }
});
</script>
