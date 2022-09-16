<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue";
import CustomHeader from "@/components/Header.vue";
import ContentLayout from "@/components/ContentLayout.vue";
</script>

<template>
  <main>
    <custom-header />

    <content-layout>
      <template #sidebar>
        <sidebar />
      </template>

      <template #workspace>
        <router-view name="workspace" />
      </template>
    </content-layout>
  </main>
</template>
