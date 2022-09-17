<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue";
import CustomHeader from "@/components/Header.vue";
import BodyLayout from "@/components/BodyLayout.vue";
</script>

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
