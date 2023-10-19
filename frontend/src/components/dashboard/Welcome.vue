<template>
  <n-h1> _Dashboard </n-h1>

  <n-h2>
    Welcome
    <n-gradient-text> {{ authStore.profile.fullName }} </n-gradient-text>
  </n-h2>

  <div>
    <n-text>
      Today is <n-tag>{{ formattedNow }}</n-tag> ({{ dayOfYear }} day)</n-text
    >
  </div>

  <div>
    <n-text depth="3">
      <small>
        ({{ remainingDays }} days left till the end of the year 2023)
      </small>
    </n-text>
  </div>
</template>

<script setup lang="ts">
import { NH2, NH1, NGradientText, NText, NTag } from "naive-ui";

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
