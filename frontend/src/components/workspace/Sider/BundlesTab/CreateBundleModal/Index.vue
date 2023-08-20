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

    <component :is="currentStep" :form-data="formData" />

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
import cloneDeep from "lodash/cloneDeep";
import { ref, computed, type Ref } from "vue";
import { NModal, NSpace, NSteps, NStep, NButton } from "naive-ui";

import FormStep from "./FormStep.vue";
import { BundleExpire } from "@shared/types/enums/BundleExpire";
import VariantsSelectionStep from "./VariantsSelectionStep.vue";
import BlueprintsSelectionStep from "./BlueprintsSelectionStep.vue";
import type { AddBundleDto } from "@shared/types/dtos/AddBundleDto";

const defaultFormData: AddBundleDto = {
  values: [],
  expiration: BundleExpire.OneDay,
};

const current = ref(1);
const formData: Ref<AddBundleDto> = ref(cloneDeep(defaultFormData));

const steps = [
  {
    title: "Select blueprints",
    description: "Choose blueprints that bundle should include.",
    value: BlueprintsSelectionStep,
    props: {},
  },

  {
    title: "Select variants",
    description: "Select file variants.",
    value: VariantsSelectionStep,
    props: {},
  },

  {
    title: "Complete bundle information",
    description: "Provide basic information about bundle.",
    value: FormStep,
    props: {},
  },
];

const currentStep = computed(
  () =>
    steps.find((step, index) => index + 1 === current.value)?.value ||
    BlueprintsSelectionStep
);
</script>
