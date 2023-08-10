<template>
  <div class="blueprints-tab">
    <div class="header">
      <n-button type="info" size="small" dashed>
        <n-icon :component="ResetIcon" :size="20" />
      </n-button>

      <!-- @TODO create common component -->
      <n-input clearable show-count placeholder="Type name or color">
        <template #prefix>
          <n-icon :component="SearchIcon" />
        </template>
      </n-input>

      <n-button type="info" size="small" dashed>
        <n-icon :component="AddIcon" :size="25" />
      </n-button>
    </div>

    <n-scrollbar>
      <n-list clickable hoverable>
        <n-list-item v-for="(blueprint, index) in items" :key="index">
          <div class="wrapper">
            <div class="content">
              <div
                class="thumbnail"
                :style="{ backgroundColor: blueprint.color }"
              ></div>

              <n-tag size="tiny">{{ blueprint.color }}</n-tag>
            </div>

            <small>{{ blueprint.name }}</small>
          </div>
        </n-list-item>
      </n-list>
    </n-scrollbar>

    <div class="footer">
      <n-icon :component="InformationIcon" size="16" />

      <small> Loaded 15 out of 200 </small>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Add as AddIcon,
  Reset as ResetIcon,
  Search as SearchIcon,
  Information as InformationIcon,
} from "@vicons/carbon";
import {
  NList,
  NIcon,
  NInput,
  NButton,
  NListItem,
  NScrollbar,
  NTag,
} from "naive-ui";

import { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";

const items: IBlueprintDto = [
  {
    id: 1,
    name: "This is my blueprint",
    color: "#7D91FF",
    createdAt: "113213213-32132",
    updatedAt: "12313",
  },
  {
    id: 2,
    name: "This is my blueprint 2",
    color: "red",
    createdAt: "113213213-32132",
    updatedAt: "12313",
  },
  {
    id: 1,
    name: "This is my blueprint",
    color: "#7D91FF",
    createdAt: "113213213-32132",
    updatedAt: "12313",
  },
  {
    id: 2,
    name: "This is my blueprint 2",
    color: "red",
    createdAt: "113213213-32132",
    updatedAt: "12313",
  },
  {
    id: 1,
    name: "This is my blueprint",
    color: "#7D91FF",
    createdAt: "113213213-32132",
    updatedAt: "12313",
  },
  {
    id: 2,
    name: "This is my blueprint 2",
    color: "red",
    createdAt: "113213213-32132",
    updatedAt: "12313",
  },
  {
    id: 1,
    name: "This is my blueprint",
    color: "#7D91FF",
    createdAt: "113213213-32132",
    updatedAt: "12313",
  },
  {
    id: 2,
    name: "This is my blueprint 2",
    color: "red",
    createdAt: "113213213-32132",
    updatedAt: "12313",
  },
  {
    id: 1,
    name: "This is my blueprint",
    color: "#7D91FF",
    createdAt: "113213213-32132",
    updatedAt: "12313",
  },
  {
    id: 2,
    name: "This is my blueprint 2",
    color: "red",
    createdAt: "113213213-32132",
    updatedAt: "12313",
  },
  {
    id: 1,
    name: "This is my blueprint",
    color: "#7D91FF",
    createdAt: "113213213-32132",
    updatedAt: "12313",
  },
  {
    id: 2,
    name: "This is my blueprint 2",
    color: "red",
    createdAt: "113213213-32132",
    updatedAt: "12313",
  },
  {
    id: 1,
    name: "This is my blueprint",
    color: "#7D91FF",
    createdAt: "113213213-32132",
    updatedAt: "12313",
  },
  {
    id: 2,
    name: "This is my blueprint 2",
    color: "red",
    createdAt: "113213213-32132",
    updatedAt: "12313",
  },
  {
    id: 1,
    name: "This is my blueprint",
    color: "#7D91FF",
    createdAt: "113213213-32132",
    updatedAt: "12313",
  },
  {
    id: 2,
    name: "This is my blueprint 2",
    color: "red",
    createdAt: "113213213-32132",
    updatedAt: "12313",
  },
  {
    id: 1,
    name: "This is my blueprint",
    color: "#7D91FF",
    createdAt: "113213213-32132",
    updatedAt: "12313",
  },
  {
    id: 2,
    name: "This is my blueprint 2",
    color: "red",
    createdAt: "113213213-32132",
    updatedAt: "12313",
  },
];
</script>
