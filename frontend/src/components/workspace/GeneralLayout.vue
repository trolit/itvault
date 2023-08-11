<template>
  <n-layout has-sider>
    <n-layout-sider
      bordered
      show-trigger
      :width="340"
      :collapsed-width="8"
      collapse-mode="transform"
      :native-scrollbar="false"
      :inverted="inverted"
      :collapsed="isCollapsed"
      @expand="isCollapsed = false"
      @collapse="isCollapsed = true"
    >
      <div class="sider">
        <slot name="sider"></slot>
      </div>
    </n-layout-sider>

    <div class="main-content-wrapper">
      <slot name="main-content"></slot>
    </div>
  </n-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NLayout, NLayoutSider } from "naive-ui";

const inverted = ref(false);
const isCollapsed = ref(false);
</script>
