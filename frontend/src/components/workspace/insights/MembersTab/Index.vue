<template>
  <div class="members-tab">
    <loading-section v-if="isLoading" spin-size="large" />

    <div class="wrapper" v-else>
      <n-grid
        x-gap="15"
        y-gap="15"
        class="grid"
        responsive="screen"
        cols="1 s:1 m:3 l:3 xl:3 2xl:3"
      >
        <n-grid-item
          v-for="item in membersTabData.items"
          :span="1"
          :key="item.id"
        >
          <member-card
            :item="item"
            :is-permitted-to-manager-user-workspaces="
              isPermittedToManagerUserWorkspaces
            "
          />
        </n-grid-item>

        <n-grid-item v-if="isPermittedToManagerUserWorkspaces" :span="1">
          <new-member-card />
        </n-grid-item>
      </n-grid>

      <n-pagination
        size="medium"
        :page-slot="6"
        :page="membersTabData.pagination.page"
        :page-size="membersTabData.pagination.perPage"
        :item-count="membersTabData.total"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { NGrid, NGridItem, NPagination } from "naive-ui";

import MemberCard from "./MemberCard.vue";
import { useAuthStore } from "@/store/auth";
import { useUsersStore } from "@/store/users";
import NewMemberCard from "./NewMemberCard.vue";
import { useGeneralStore } from "@/store/general";
import { useInsightsStore } from "@/store/insights";
import { useWorkspacesStore } from "@/store/workspaces";
import { Permission } from "@shared/types/enums/Permission";
import LoadingSection from "@/components/common/LoadingSection.vue";

const authStore = useAuthStore();
const usersStore = useUsersStore();
const generalStore = useGeneralStore();
const insightsStore = useInsightsStore();
const workspacesStore = useWorkspacesStore();

const { membersTabData } = storeToRefs(insightsStore);

const isLoading = ref(false);

onBeforeMount(() => {
  if (!membersTabData.value.items.length) {
    fetchAll();
  }
});

async function fetchAll() {
  isLoading.value = true;

  const { pagination } = membersTabData.value;

  try {
    const { result, total } = await usersStore.getAll({
      ...pagination,
      filters: { workspaceId: workspacesStore.activeItemId },
    });

    membersTabData.value.total = total;
    membersTabData.value.items = result;
  } catch (error) {
    console.error(error);

    generalStore.messageProvider.error(
      `Failed to fetch page ${pagination.page} of members.`
    );
  } finally {
    isLoading.value = false;
  }
}

const isPermittedToManagerUserWorkspaces = computed(() =>
  authStore.hasPermission(Permission.ManageUserWorkspaces)
);
</script>
