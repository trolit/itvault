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

    <component
      :is="currentStep.value"
      :form-data="formData"
      v-on="currentStep.events"
      v-bind="currentStep.props"
    />

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
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";

const defaultFormData: AddBundleDto = {
  values: [],
  expiration: BundleExpire.OneDay,
};

const current = ref(1);
const selectedBlueprints: Ref<IBlueprintDto[]> = ref([]);
const formData: Ref<AddBundleDto> = ref(cloneDeep(defaultFormData));

const steps = [
  {
    title: "Select blueprints",
    description: "Choose blueprint(s) that bundle should include.",
    value: BlueprintsSelectionStep,
    props: {
      selectedBlueprints: selectedBlueprints.value,
    },
    events: {
      "select-blueprint": onBlueprintSelect,
      "deselect-blueprint": onBlueprintDeselect,
    },
  },

  {
    title: "Select variants",
    description: "Select file variants.",
    value: VariantsSelectionStep,
    props: {},
    events: {},
  },

  {
    title: "Complete bundle information",
    description: "Provide basic information about bundle.",
    value: FormStep,
    props: {},
    events: {},
  },
];

const currentStep = computed(
  () =>
    steps.find((step, index) => index + 1 === current.value) ||
    BlueprintsSelectionStep
);

function onBlueprintSelect(blueprintToAdd: IBlueprintDto) {
  const blueprintIndex = selectedBlueprints.value.findIndex(
    element => element.id === blueprintToAdd.id
  );

  if (~blueprintIndex) {
    selectedBlueprints.value.splice(blueprintIndex, 1);

    return;
  }

  selectedBlueprints.value.push(blueprintToAdd);
}

function onBlueprintDeselect(id: number) {
  const blueprintIndex = selectedBlueprints.value.findIndex(
    element => element.id === id
  );

  if (~blueprintIndex) {
    selectedBlueprints.value.splice(blueprintIndex, 1);

    return;
  }
}
</script>
