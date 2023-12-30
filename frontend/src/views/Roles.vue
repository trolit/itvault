<template>
  <div class="roles-page page">
    <div class="header">
      <require-permission :permission="Permission.CreateRole">
        <n-button
          secondary
          size="small"
          type="success"
          :disabled="includesNewRoleTab || rolesStore.isAddLimitReached"
          @click="rolesStore.addEmptyTab"
        >
          <n-icon :component="AddIcon" :size="25" />
        </n-button>
      </require-permission>

      <!-- @TODO -->
      <n-input clearable placeholder="Type name to filter" disabled>
        <template #prefix>
          <n-icon :component="SearchIcon" />
        </template>
      </n-input>
    </div>

    <n-grid
      x-gap="10"
      y-gap="10"
      responsive="screen"
      cols="1 s:1 m:3 l:3 xl:3 2xl:3"
    >
      <n-grid-item v-if="includesAnyTab" span="1">
        <n-card>
          <roles-tabs @create-role="onRoleCreate" @update-role="onRoleUpdate" />
        </n-card>
      </n-grid-item>

      <n-grid-item :span="includesAnyTab ? 2 : 3">
        <roles-table
          :page="page"
          :total="total"
          :data="data.value"
          :per-page="perPage"
          :is-loading="isLoading"
          @get-roles="getRoles"
        />
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { Add as AddIcon, Search as SearchIcon } from "@vicons/carbon";
import { NCard, NGrid, NIcon, NInput, NButton, NGridItem } from "naive-ui";

import { useAuthStore } from "@/store/auth";
import { useRolesStore } from "@/store/roles";
import { useGeneralStore } from "@/store/general";
import RolesTabs from "@/components/roles/Tabs.vue";
import RolesTable from "@/components/roles/Table.vue";
import type { IRoleDTO } from "@shared/types/DTOs/Role";
import { useDateService } from "@/services/useDateService";
import { Permission } from "@shared/types/enums/Permission";
import type { IAddEditRoleDTO } from "@shared/types/DTOs/Role";
import RequirePermission from "@/components/common/RequirePermission.vue";

const authStore = useAuthStore();
const rolesStore = useRolesStore();
const dateService = useDateService();
const generalStore = useGeneralStore();

const page = ref(1);
const perPage = 8;
const total = ref(0);
const isLoading = ref(false);
let data: { value: IRoleDTO[] } = reactive({ value: [] });
const { includesAnyTab, includesNewRoleTab } = storeToRefs(rolesStore);

function onRoleCreate(id: number) {
  rolesStore.promoteCreateRoleTabToEditRoleTab(id);

  getRoles(1);
}

function onRoleUpdate(id: number, payload: IAddEditRoleDTO) {
  const item = data.value.find(item => item.id === id);

  if (item) {
    item.name = payload.name;
    item.description = payload.description;

    // @TMP (if we implement websockets)
    const { id, fullName } = authStore.profile;

    item.updatedBy = { id, fullName };

    item.updatedAt = dateService.now().toISOString();
  }
}

async function getRoles(newPage: number) {
  isLoading.value = true;

  page.value = newPage;

  try {
    const response = await rolesStore.getAll({
      page: newPage,
      perPage,
    });

    data.value = response.result;

    total.value = response.total;
  } catch (error) {
    console.log(error);

    generalStore.messageProvider.error(
      "There was an error when trying to load roles."
    );
  } finally {
    isLoading.value = false;
  }
}
</script>
