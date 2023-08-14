<template>
  <!-- @TODO show some indicator if message is removed or not (display only if permission is enabled)-->
  <n-thing content-indented class="single-note">
    <template #header> {{ note.createdBy.fullName }} </template>

    <template #header-extra>
      {{ formatDate(note.createdAt, "YYYY-MM-DD HH:mm") }}
    </template>

    <template #description>
      <n-tag size="small" type="info">
        {{ note.createdBy.role }}
      </n-tag>
    </template>

    <!-- @TODO markdown compiler -->
    <n-card>
      {{ note.value }}
    </n-card>
  </n-thing>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NThing, NTag, NCard } from "naive-ui";
import type { PropType } from "vue";

import formatDate from "@/helpers/dayjs/formatDate";
import type { INoteDto } from "@shared/types/dtos/INoteDto";

const props = defineProps({
  note: {
    type: Object as PropType<INoteDto>,
    required: true,
  },
});

const note = computed(() => {
  return props.note;
});
</script>
