<template>
  <div class="blueprints-tab">
    <n-thing>
      <div class="header">
        <n-button type="warning" size="small">
          <n-icon :component="ResetIcon" :size="20" />
        </n-button>

        <!-- @TODO create common component (?) -->
        <n-input clearable show-count placeholder="Type name or color">
          <template #prefix>
            <n-icon :component="SearchIcon" />
          </template>
        </n-input>

        <require-permission :permission="Permission.CreateBlueprint">
          <n-button size="small" @click="toggleAddEditBlueprintDrawer()">
            <n-icon :component="AddIcon" :size="25" />
          </n-button>
        </require-permission>
      </div>
    </n-thing>

    <n-scrollbar>
      <n-list v-if="!isLoading" clickable hoverable>
        <n-list-item
          v-for="(blueprint, index) in blueprintsStore.items"
          :key="index"
          @click="toggleAddEditBlueprintDrawer(blueprint)"
        >
          <div class="wrapper">
            <div class="content">
              <div
                class="thumbnail"
                :style="{ backgroundColor: blueprint.color }"
              />

              <n-tag size="tiny">{{ blueprint.color }}</n-tag>
            </div>

            <small>{{ blueprint.name }}</small>
          </div>
        </n-list-item>
      </n-list>

      <div v-else class="spinner">
        <n-spin />
      </div>
    </n-scrollbar>

    <div class="footer">
      <n-pagination
        size="small"
        :page-slot="6"
        :page="page.value"
        :page-size="perPage"
        :item-count="blueprintsStore.total"
        @update:page="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Add as AddIcon,
  Reset as ResetIcon,
  Search as SearchIcon,
} from "@vicons/carbon";
import cloneDeep from "lodash/cloneDeep";
import {
  NTag,
  NSpin,
  NList,
  NIcon,
  NInput,
  NThing,
  NButton,
  NListItem,
  NScrollbar,
  NPagination,
} from "naive-ui";
import { onMounted, ref, type PropType, type Ref } from "vue";

import { Drawer } from "@/types/enums/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { useBlueprintsStore } from "@/store/blueprints";
import { Permission } from "@shared/types/enums/Permission";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";
import RequirePermission from "@/components/common/RequirePermission.vue";

const drawerStore = useDrawerStore();
const blueprintsStore = useBlueprintsStore();

const perPage = 11;
const isLoading = ref(false);

const props = defineProps({
  page: {
    type: Object as PropType<Ref<number>>,
    required: true,
  },
});

const emit = defineEmits(["update:page"]);

onMounted(() => {
  if (blueprintsStore.total === 0) {
    getBlueprints(props.page.value);
  }
});

function toggleAddEditBlueprintDrawer(newItemToEdit?: IBlueprintDto) {
  const isSameItemToEdit = !!(
    blueprintsStore.itemToEdit?.id === newItemToEdit?.id
  );

  blueprintsStore.itemToEdit = newItemToEdit ? cloneDeep(newItemToEdit) : null;

  if (
    !isSameItemToEdit &&
    drawerStore.isDrawerActive(Drawer.AddEditBlueprint)
  ) {
    return;
  }

  drawerStore.setActiveDrawer(Drawer.AddEditBlueprint);
}

function onPageChange(newPage: number) {
  emit("update:page", newPage);

  getBlueprints(newPage);
}

async function getBlueprints(page: number) {
  isLoading.value = true;

  try {
    await blueprintsStore.getAll({ page, perPage });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
