<template>
  <n-modal
    preset="card"
    title="Generate Bundle"
    :mask-closable="false"
    class="create-bundle-modal"
  >
    <n-space vertical class="steps-wrapper">
      <!-- @TODO implement status (to cover validation) -->
      <n-steps :current="current">
        <n-step
          v-for="(step, index) in steps"
          :key="index"
          :title="step.title"
          :description="step.description"
        />
      </n-steps>
    </n-space>

    <n-scrollbar class="content-scrollbar">
      <component :is="currentStep" />
    </n-scrollbar>

    <div class="actions">
      <n-button @click="current--" :disabled="current === 1">
        Previous
      </n-button>

      <n-button @click="current++" :disabled="current === steps.length">
        Next
      </n-button>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { NModal, NSpace, NSteps, NStep, NButton, NScrollbar } from "naive-ui";

import FormStep from "./FormStep.vue";
import VariantsSelectionStep from "./VariantsSelectionStep.vue";
import BlueprintsSelectionStep from "./BlueprintsSelectionStep.vue";

const current = ref(1);

const steps = [
  {
    title: "Blueprints",
    description: "Select blueprints that you would like to include in bundle.",
    value: BlueprintsSelectionStep,
  },

  {
    title: "Variants",
    description: "Pick file variants.",
    value: VariantsSelectionStep,
  },

  {
    title: "Form",
    description: "Complete basic information about bundle.",
    value: FormStep,
  },
];

const currentStep = computed(
  () =>
    steps.find((step, index) => index + 1 === current.value)?.value ||
    BlueprintsSelectionStep
);
</script>
