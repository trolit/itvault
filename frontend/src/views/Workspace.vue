<template>
  <main>
    <body-layout>
      <template #sidebar>
        <sidebar />
      </template>

      <template #content>
        <router-view name="content" />
      </template>
    </body-layout>
  </main>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";

import BodyLayout from "@/components/BodyLayout.vue";
import Sidebar from "@/components/sidebar/Index.vue";

const route = useRoute();

onBeforeMount(() => {
  const {
    params: { slug },
  } = route;

  console.log(slug);
});
</script>
