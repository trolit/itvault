<template>
  <n-thing content-indented>
    <template #header> Money </template>

    <template #header-extra> date </template>

    <template #description> Description </template>

    Money is any item or verifiable record that is generally accepted as payment
    for goods and services and repayment of debts, such as taxes, in a
    particular country or socio-economic context.
  </n-thing>
</template>

<script setup lang="ts">
import { NThing } from "naive-ui";
</script>
