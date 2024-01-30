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
      <n-list-item v-if="isPermittedToManagerUserWorkspaces">
        <n-button disabled type="error"> Remove from workspace </n-button>
      </n-list-item>
    </n-list>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NText, NList, NListItem, NTag, NButton } from "naive-ui";

import type { IUserDTO } from "@shared/types/DTOs/User";
interface IProps {
  item: IUserDTO;

  isPermittedToManagerUserWorkspaces: boolean;
}

defineProps<IProps>();
</script>
