<template>
  <div class="file-page">
    <n-card :segmented="{ content: true }">
      <template #header>
        <card-header />
      </template>

      <!-- @TODO scroll -->
      <template #default>
        <variant-viewer v-if="variantStore.activeItem" />

        <empty v-else title="Select variant to display file content." />
      </template>
    </n-card>

    <!-- @TODO variant header section -->

    <!-- @TODO notes drawer -->

    <!-- @TODO variant content READ + MANAGE -->
  </div>
</template>

<script setup lang="ts">
import { NCard } from "naive-ui";

import CardHeader from "./CardHeader.vue";
import Empty from "@/components/common/Empty.vue";
import { useVariantsStore } from "@/store/variants";
import VariantViewer from "./VariantViewer/Index.vue";

const variantStore = useVariantsStore();
</script>
