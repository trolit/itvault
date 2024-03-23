<template>
  <n-tabs
    type="card"
    closable
    animated
    justify-content="space-evenly"
    v-model:value="rolesStore.activeRoleId"
    @close="rolesStore.closeTab"
  >
    <n-tab-pane
      :key="tab.roleId"
      :name="tab.roleId"
      :tab="getTabTitle(tab)"
      v-for="tab in tabs"
    >
      <n-scrollbar class="tab-scroll" trigger="none">
        <add-edit-form
          :role-tab="tab"
          @create-role="(...args) => $emit('create-role', ...args)"
          @update-role="(...args) => $emit('update-role', ...args)"
        />
      </n-scrollbar>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { h } from "vue";
import { storeToRefs } from "pinia";
import { NTabs, NTabPane, NScrollbar } from "naive-ui";

import AddEditForm from "./AddEditForm.vue";
import { useRolesStore } from "@/store/roles";
import type { RoleTab } from "@/types/RoleTab";

const rolesStore = useRolesStore();

defineEmits(["create-role", "update-role"]);

const { tabs } = storeToRefs(rolesStore);

function getTabTitle(tab: RoleTab) {
  const {
    initialForm: { name },
  } = tab;

  const nameSpan = h("span", name);

  return tab.roleId !== 0 &&
    JSON.stringify(tab.initialForm) !== JSON.stringify(tab.currentForm)
    ? h("span", [h("span", { style: { color: "red" } }, "*"), nameSpan])
    : nameSpan;
}
</script>
