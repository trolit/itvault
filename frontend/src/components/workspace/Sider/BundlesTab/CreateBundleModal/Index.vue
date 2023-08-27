<template>
  <n-modal
    preset="card"
    title="Generate Bundle"
    :mask-closable="false"
    class="create-bundle-modal"
    @close="$emit('update:show', false)"
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
      v-on="currentStep.events"
      v-bind="currentStep.props"
    />

    <div class="actions">
      <n-button @click="current--" :disabled="current === 1">
        Previous
      </n-button>

      <n-button
        :loading="isSubmittingForm"
        :disabled="isFinalStep ? false : currentStep.isNextButtonDisabled()"
        @click="isFinalStep ? onSubmit() : current++"
      >
        {{ isFinalStep ? "Submit" : "Next" }}
      </n-button>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from "vue";
import { NModal, NSpace, NSteps, NStep, NButton } from "naive-ui";

import FormStep from "./FormStep.vue";
import { useMessage } from "naive-ui";
import { useBundlesStore } from "@/store/bundles";
import type { BundleModalItem } from "@/types/BundleModalItem";
import { BundleExpire } from "@shared/types/enums/BundleExpire";
import VariantsSelectionStep from "./VariantsSelectionStep.vue";
import BlueprintsSelectionStep from "./BlueprintsSelectionStep.vue";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";
import type { IFileVariantDto } from "@shared/types/dtos/IFileVariantDto";
import type { Value } from "@shared/types/dtos/AddBundleDto";

const emit = defineEmits(["update:show"]);

const note = ref("");
const current = ref(1);
const message = useMessage();
const isSubmittingForm = ref(false);
const bundlesStore = useBundlesStore();
const expiration = ref(BundleExpire.OneDay);
const items: Ref<BundleModalItem[]> = ref([]);

const selectedBlueprints = computed(() =>
  items.value.map(({ blueprint }) => blueprint)
);

const steps = [
  {
    title: "Blueprints",
    description: "Choose blueprint(s) that bundle should include.",
    value: BlueprintsSelectionStep,
    props: {
      items: items.value,
      selectedBlueprints: selectedBlueprints.value,
    },
    events: {
      "select-blueprint": onBlueprintSelect,
      "deselect-blueprint": onBlueprintDeselect,
    },
    isNextButtonDisabled: () => selectedBlueprints.value.length === 0,
  },

  {
    title: "Variants",
    description: "Preview file variants and adjust (if needed).",
    value: VariantsSelectionStep,
    props: {
      items: items.value,
      selectedBlueprints: selectedBlueprints.value,
    },
    events: {
      "add-files": onFilesAdd,
    },
    isNextButtonDisabled: () => items.value.some(item => !item.files.length),
  },

  {
    title: "Information",
    description: "Provide basic information about bundle.",
    value: FormStep,
    props: {
      note: note.value,
      expiration: expiration.value,
    },
    events: {
      "update:note": (value: string) => (note.value = value),
      "update:expiration": (value: BundleExpire) => (expiration.value = value),
    },
    isNextButtonDisabled: () => current.value === 3,
  },
];

const currentStep = computed(
  () =>
    steps.find((step, index) => index + 1 === current.value) ||
    BlueprintsSelectionStep
);

const isFinalStep = computed(() => current.value === steps.length);

function onBlueprintSelect(blueprintToAdd: IBlueprintDto) {
  const index = items.value.findIndex(
    element => element.blueprint.id === blueprintToAdd.id
  );

  if (~index) {
    onBlueprintDeselect(blueprintToAdd);

    return;
  }

  items.value.push({ blueprint: blueprintToAdd, files: [] });
}

function onBlueprintDeselect(blueprintToDeselect: IBlueprintDto) {
  const index = items.value.findIndex(
    element => element.blueprint.id === blueprintToDeselect.id
  );

  if (~index) {
    items.value.splice(index, 1);
  }
}

function onFilesAdd(blueprintId: number, filesToAdd: IFileVariantDto[]) {
  const item = items.value.find(item => item.blueprint.id === blueprintId);

  if (!item) {
    return;
  }

  item.files = filesToAdd.map(fileToAdd => {
    const [firstVariant] = fileToAdd.variants;

    return { ...fileToAdd, selectedVariantId: firstVariant.id };
  });
}

async function onSubmit() {
  isSubmittingForm.value = true;

  const values: Value[] = items.value.map(item => ({
    blueprintId: item.blueprint.id,
    variantIds: item.files.map(file => file.selectedVariantId),
  }));

  try {
    await bundlesStore.store({
      values,
      note: note.value,
      expiration: expiration.value,
    });

    message.success("Bundle successfully queued.");

    emit("update:show", false);
  } catch (error) {
    console.log(error);
  } finally {
    isSubmittingForm.value = false;
  }
}
</script>
