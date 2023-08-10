<template>
  <div class="blueprints">
    <div class="header">
      <n-tag type="info"> Blueprints </n-tag>

      <n-button type="info" size="small"> New </n-button>
    </div>

    <n-card>
      <n-list clickable hoverable>
        <n-list-item v-for="(blueprint, index) in items" :key="index">
          <div class="wrapper">
            <div class="content">
              <div
                class="thumbnail"
                :style="{ backgroundColor: blueprint.color }"
              ></div>

              {{ blueprint.name }}
            </div>
          </div>
        </n-list-item>
      </n-list>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NList, NListItem, NButton, NTag, NCard } from "naive-ui";

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
];
</script>
