<template>
  <main>
    <custom-header />

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
import BodyLayout from "@/components/BodyLayout.vue";
import Sidebar from "@/components/sidebar/Index.vue";
import CustomHeader from "@/components/header/Index.vue";
</script>
