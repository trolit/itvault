<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue";
import PageHeader from "@/components/PageHeader.vue";
import PageBodyLayout from "@/components/PageBodyLayout.vue";
</script>

<template>
  <main>
    <page-header />

    <page-body-layout>
      <template #sidebar>
        <sidebar />
      </template>

      <template #content>
        <router-view name="content" />
      </template>
    </page-body-layout>
  </main>
</template>
