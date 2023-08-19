<template>
  <n-thing>
    <template #avatar>
      <n-avatar>
        <n-icon :component="BlueprintIcon" />
      </n-avatar>
    </template>

    <template #header> Blueprints </template>

    <n-spin v-if="isLoading" />

    <div v-else>
      <bundle-blueprint
        v-for="blueprint in blueprints"
        :key="blueprint.id"
        :value="blueprint"
      />
    </div>
  </n-thing>
</template>

<script setup lang="ts">
import { ref, type PropType, onMounted } from "vue";
import { NSpin, NIcon, NThing, NAvatar } from "naive-ui";
import { PaintBrush as BlueprintIcon } from "@vicons/carbon";

import { useBundlesStore } from "@/store/bundles";
import BundleBlueprint from "./BundleBlueprint.vue";
import type { IBundleBlueprintDto } from "@shared/types/dtos/IBundleBlueprintDto";

const props = defineProps({
  blueprints: {
    type: Object as PropType<IBundleBlueprintDto[]>,
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
