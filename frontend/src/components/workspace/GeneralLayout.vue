<template>
  <n-layout has-sider>
    <n-layout-sider
      show-trigger
      :width="340"
      :collapsed-width="12"
      collapse-mode="transform"
      :native-scrollbar="false"
      :inverted="inverted"
      :collapsed="isCollapsed"
      @expand="isCollapsed = false"
      @collapse="isCollapsed = true"
    >
      <slot name="blueprints"></slot>

      <slot name="files"></slot>
    </n-layout-sider>

    <n-layout>
      <slot name="content"></slot>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NLayout, NLayoutSider } from "naive-ui";

const inverted = ref(false);
const isCollapsed = ref(false);
</script>
