<template>
  <div class="variant-viewer">
    <div class="line-numbers">
      <span v-for="index in numberOfLines" :key="index"></span>
    </div>

    <text-render />
  </div>
</template>

<script setup lang="ts">
import { h, ref, computed, type VNode } from "vue";

const text = ref("test1 test2\ntest3\nelo");

const numberOfLines = computed((): number => {
  return text.value.split("\n").length;
});

const textRender = computed((): VNode => {
  const splitText = text.value.toString().split("\n");

  const children = splitText.map(part => h("div", part));

  return h("div", { class: "text-render" }, children);
});
</script>
