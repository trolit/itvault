<template>
  <n-card class="member-card" :title="item.fullName">
    <n-list>
      <n-list-item>
        <template #prefix> Role </template>

        <n-tag>{{ item.roleName }}</n-tag>
      </n-list-item>

      <n-list-item>
        <template #prefix> Email </template>

        <n-text :depth="3"> {{ item.email }} </n-text>
      </n-list-item>

      <!-- @TODO -->
      <require-permission :permission="Permission.ManageUserWorkspaces">
        <n-list-item>
          <n-button disabled type="error"> Remove from workspace </n-button>
        </n-list-item>
      </require-permission>
    </n-list>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NText, NList, NListItem, NTag, NButton } from "naive-ui";

import type { IUserDTO } from "@shared/types/DTOs/User";
import { Permission } from "@shared/types/enums/Permission";
import RequirePermission from "@/components/common/RequirePermission.vue";
interface IProps {
  item: IUserDTO;
}

defineProps<IProps>();
</script>
