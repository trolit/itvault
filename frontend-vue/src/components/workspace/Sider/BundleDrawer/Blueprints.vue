<template>
  <n-thing>
    <template #avatar>
      <n-avatar>
        <n-icon :component="BlueprintIcon" />
      </n-avatar>
    </template>

    <template #header> Blueprints </template>

    <loading-section v-if="isLoading" />

    <div v-else>
      <blueprint
        v-for="blueprint in blueprints"
        :key="blueprint.id"
        :value="blueprint"
      />
    </div>
  </n-thing>
</template>

<script setup lang="ts">
import { NIcon, NThing, NAvatar } from "naive-ui";
import { ref, type PropType, onMounted } from "vue";
import { PaintBrush as BlueprintIcon } from "@vicons/carbon";

import Blueprint from "./Blueprint.vue";
import { useBundlesStore } from "@/store/bundles";
import type { BundleBlueprint } from "@/types/BundleBlueprint";
import LoadingSection from "@/components/common/LoadingSection.vue";

const props = defineProps({
  blueprints: {
    type: Object as PropType<BundleBlueprint[]>,
    required: true,
  },
});

const isLoading = ref(false);
const bundlesStore = useBundlesStore();

onMounted(async () => {
  if (!props.blueprints.length) {
    isLoading.value = true;

    try {
      await bundlesStore.getBlueprints();
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  }
});
</script>
