<template>
  <n-thing content-indented class="single-bundle">
    <template #header>
      <div>
        file.zip

        <n-gradient-text type="warning" :size="18"> (128B) </n-gradient-text>
      </div>
    </template>

    <template #header-extra>
      <n-tag size="small">queried</n-tag>
    </template>

    <template #description>
      <ul>
        <li>expires at 02-10-2023 15:10</li>
        <li>requested by Aga 123</li>
      </ul>
    </template>

    <div class="note">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec porttitor
      purus sit amet leo commodo tristique. Pellentesque habitant morbi
      tristique senectus et netus et malesuada fames ac turpis egestas.
    </div>

    <template #footer>
      <n-button type="error" ghost size="small">delete</n-button>

      <n-button type="info" ghost size="small">requeue</n-button>

      <n-button type="success" ghost size="small">download</n-button>
    </template>
  </n-thing>
</template>

<script setup lang="ts">
import { NThing, NButton, NTag, NGradientText } from "naive-ui";
</script>
