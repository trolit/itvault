<template>
  <n-space justify="space-between" align="center">
    <div :style="{ fontSize: '25px' }">
      Welcome
      <n-gradient-text> {{ authStore.profile.fullName }} </n-gradient-text>,
    </div>

    <div class="text-center">
      <n-text>
        <n-tag>{{ formattedNow }}</n-tag> ({{ dayOfYear }} day)
      </n-text>

      <div>
        <n-text depth="3">
          <small>
            ({{ remainingDays }} days left till the end of the year 2023)
          </small>
        </n-text>
      </div>
    </div>
  </n-space>
</template>

<script setup lang="ts">
import { NGradientText, NText, NTag, NSpace } from "naive-ui";

import { useAuthStore } from "@/store/auth";
import { useDateService } from "@/services/useDateService";

const authStore = useAuthStore();
const dateService = useDateService();

const nowDate = dateService.now();
const endOfYearDate = dateService.endOf("year");

const dayOfYear = dateService.dayOfYear(nowDate);
const formattedNow = nowDate.format("DD MMMM YYYY");
const remainingDays = dateService.difference(endOfYearDate, nowDate, "day");
</script>
