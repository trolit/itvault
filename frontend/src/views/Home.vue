<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue";
import PageHeader from "@/components/PageHeader.vue";
import ContentLayout from "@/components/ContentLayout.vue";
</script>

<template>
  <main>
    <page-header />

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
