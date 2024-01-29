<template>
  <n-card size="medium" :style="{ height: '100%' }">
    <div :style="{ fontSize: '25px' }">
      Welcome

      <n-gradient-text> {{ authStore.profile.fullName }} </n-gradient-text>,
    </div>

    <div>
      <n-text> {{ formattedNow }} (Day {{ dayOfYear }}) </n-text>

      <div>
        <n-text depth="3">
          <em>
            <small>
              {{ remainingDays }} days left till the end of the year
            </small>
          </em>
        </n-text>
      </div>
    </div>

    <n-divider dashed />

    <!-- @TODO create permission that allows to create annoucements. Here we should have slider or smth -->
    <div>
      <strong>📌 Annoucement(s)</strong>

      <div>
        <em> @TODO </em>
      </div>
    </div>

    <n-divider dashed />

    <!-- @TODO create array of changes object. Latest object should be rendered here -->
    <div>
      <strong>🔋 Last update changes (20.01.2017)</strong>

      <div>
        <em> @TODO </em>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { NGradientText, NText, NCard, NDivider } from "naive-ui";

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
