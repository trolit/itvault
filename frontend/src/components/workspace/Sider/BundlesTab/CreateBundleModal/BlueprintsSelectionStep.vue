<template>
  <div class="blueprints-step">Blueprints (selection)</div>
</template>

<script setup lang="ts">
import { ref, type PropType, onBeforeMount, type Ref } from "vue";

import { useBlueprintsStore } from "@/store/blueprints";
import type { AddBundleDto } from "@shared/types/dtos/AddBundleDto";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";

const page = ref(1);
const total = ref(0);
const blueprintsStore = useBlueprintsStore();
const blueprints: Ref<IBlueprintDto[]> = ref([]);

defineProps({
  formData: {
    type: Object as PropType<AddBundleDto>,
    required: true,
  },
});

const emit = defineEmits(["is-loading"]);

onBeforeMount(async () => {
  await fetchBlueprints();
});

async function fetchBlueprints() {
  emit("is-loading", true);

  try {
    const data = await blueprintsStore.getAll({ page: page.value });

    total.value = data.total;

    blueprints.value = data.result;
  } catch (error) {
    console.log(error);
  } finally {
    emit("is-loading", false);
  }
}
</script>
