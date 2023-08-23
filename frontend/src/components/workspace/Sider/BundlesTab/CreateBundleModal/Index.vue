<template>
  <n-modal
    preset="card"
    title="Generate Bundle"
    :mask-closable="false"
    class="create-bundle-modal"
  >
    <n-space vertical class="steps-wrapper">
      <!-- @TODO implement status (to cover validation) -->
      <n-steps :current="current" size="small">
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
      @update:form-data="onFormDataUpdate"
    />

    <div class="actions">
      <n-button @click="current--" :disabled="current === 1">
        Previous
      </n-button>

      <n-button
        @click="current++"
        :disabled="currentStep.nextButtonCondition()"
      >
        {{ current === steps.length ? "Submit" : "Next" }}
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
import type { IFileVariantDto } from "@shared/types/dtos/IFileVariantDto";

const defaultFormData: AddBundleDto = {
  values: [],
  expiration: BundleExpire.OneDay,
};

const current = ref(1);
const files: Ref<IFileVariantDto[][]> = ref([]);
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
    nextButtonCondition: () => selectedBlueprints.value.length === 0,
  },

  {
    title: "Select variants",
    description: "Preview file variants and adjust (if needed).",
    value: VariantsSelectionStep,
    props: {
      files: files.value,
      selectedBlueprints: selectedBlueprints.value,
    },
    events: {
      "add-files": onFilesAdd,
    },
    nextButtonCondition: () => false,
  },

  {
    title: "Complete bundle information",
    description: "Provide basic information about bundle.",
    value: FormStep,
    props: {},
    events: {},
    nextButtonCondition: () => current.value === 3,
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
    onBlueprintDeselect(blueprintToAdd.id);

    return;
  }

  selectedBlueprints.value.push(blueprintToAdd);

  formData.value.values.push({
    blueprintId: blueprintToAdd.id,
    variantIds: [],
  });
}

function onBlueprintDeselect(id: number) {
  const blueprintIndex = selectedBlueprints.value.findIndex(
    element => element.id === id
  );

  if (~blueprintIndex) {
    files.value.splice(blueprintIndex, 1);

    const formDataIndex = formData.value.values.findIndex(
      value => value.blueprintId === id
    );

    if (~formDataIndex) {
      formData.value.values.splice(formDataIndex, 1);
    }

    selectedBlueprints.value.splice(blueprintIndex, 1);

    return;
  }
}

function onFilesAdd(blueprintId: number, filesToAdd: IFileVariantDto[]) {
  files.value.push(filesToAdd);

  const formDataValue = formData.value.values.find(
    value => value.blueprintId === blueprintId
  );

  // @NOTE set default variantIds
  if (formDataValue) {
    for (const file of filesToAdd) {
      const [firstVariant] = file.variants;

      formDataValue.variantIds.push(firstVariant.id);
    }
  }
}

function onFormDataUpdate(value: AddBundleDto) {
  formData.value = { ...value };
}
</script>
