<template>
  <div class="variant-viewer">
    <div class="line-numbers">
      <span v-for="index in numberOfLines" :key="index"></span>
    </div>

    <text-to-render />
  </div>
</template>

<script setup lang="ts">
import { h, ref, computed } from "vue";

const text = ref("test1 test2\ntest3\nelo");

const numberOfLines = computed((): number => {
  return text.value.split("\n").length;
});

const textToRender = h(
  "div", // type
  { id: "foo", class: "bar", innerHTML: text }, // props
  []
);
</script>
