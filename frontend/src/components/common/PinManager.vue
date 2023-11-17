<template>
  <div>
    <require-permission
      v-if="!pinnedAt"
      :permission="Permission.UpdateWorkspace"
    >
      <n-button
        size="tiny"
        tertiary
        :loading="isLoading"
        @click.stop="$emit('pin')"
      >
        Pin
      </n-button>
    </require-permission>

    <n-tooltip v-if="pinnedAt" trigger="hover">
      <template #trigger>
        <n-icon-wrapper :size="22" color="#66CC99" :border-radius="5">
          <n-icon :component="PinIcon" color="#28513D" :size="16" />
        </n-icon-wrapper>
      </template>

      (pinned {{ dateService.fromNow(pinnedAt) }}) &nbsp;

      <require-permission :permission="Permission.UpdateWorkspace">
        <n-button
          secondary
          type="warning"
          :loading="isLoading"
          @click.stop="$emit('unpin')"
        >
          Unpin?
        </n-button>
      </require-permission>
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
import { PinFilled as PinIcon } from "@vicons/carbon";
import { NIcon, NButton, NTooltip, NIconWrapper } from "naive-ui";

import { useDateService } from "@/services/useDateService";
import { Permission } from "@shared/types/enums/Permission";
import RequirePermission from "@/components/common/RequirePermission.vue";

interface IProps {
  pinnedAt: string | null;

  isLoading: boolean;
}

defineProps<IProps>();

defineEmits(["pin", "unpin"]);

const dateService = useDateService();
</script>
