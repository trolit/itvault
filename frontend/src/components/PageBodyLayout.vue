<template>
  <n-layout class="page-body-layout" has-sider>
    <n-layout-sider
      bordered
      show-trigger
      :width="240"
      collapse-mode="width"
      :collapsed-width="64"
    >
      <slot name="sidebar"> sidebar </slot>
    </n-layout-sider>

    <n-layout>
      <slot name="content"> content </slot>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { NLayout, NLayoutSider } from "naive-ui";
</script>
