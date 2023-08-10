<template>
  <n-layout has-sider>
    <n-layout-sider
      bordered
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
      <div class="blueprints">
        <slot name="blueprints"></slot>
      </div>

      <div class="files">
        <slot name="files"></slot>
      </div>
    </n-layout-sider>

    <div class="content">
      <slot name="content"></slot>
    </div>
  </n-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NLayout, NLayoutSider } from "naive-ui";

const inverted = ref(false);
const isCollapsed = ref(false);
</script>
