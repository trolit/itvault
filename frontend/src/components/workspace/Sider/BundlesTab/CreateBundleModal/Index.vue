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
import { useBundlesStore } from "@/store/bundles";
import { useGeneralStore } from "@/store/general";
import type { BundleModalItem } from "@/types/BundleModalItem";
import type { IFileVariantDTO } from "@shared/types/DTOs/File";
import { BundleExpire } from "@shared/types/enums/BundleExpire";
import VariantsSelectionStep from "./VariantsSelectionStep.vue";
import type { IBlueprintDTO } from "@shared/types/DTOs/Blueprint";
import BlueprintsSelectionStep from "./BlueprintsSelectionStep.vue";
import type { IAddBundleValueDTO } from "@shared/types/DTOs/Bundle";

const bundlesStore = useBundlesStore();
const generalStore = useGeneralStore();

const emit = defineEmits(["update:show"]);

const note = ref("");
const current = ref(1);
const isSubmittingForm = ref(false);
const isVariantConflict = ref(false);
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
      selectedBlueprints,
    },
    events: {
      "select-blueprint": onBlueprintSelect,
      "deselect-blueprint": onBlueprintDeselect,
    },
    isNextButtonDisabled: () => selectedBlueprints.value.length === 0,
  },

  {
    title: "Variants",
    description: "Review variants.",
    value: VariantsSelectionStep,
    props: {
      items,
      selectedBlueprints,
    },
    events: {
      "add-files": onFilesAdd,
      "update:is-variant-conflict": (value: boolean) =>
        (isVariantConflict.value = value),
    },
    isNextButtonDisabled: () =>
      items.value.some(item => !item.files.length) ||
      isVariantConflict.value === true,
  },

  {
    title: "Information",
    description: "Provide basic information.",
    value: FormStep,
    props: {
      note,
      expiration,
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

function onBlueprintSelect(blueprintToAdd: IBlueprintDTO) {
  const index = items.value.findIndex(
    element => element.blueprint.id === blueprintToAdd.id
  );

  if (~index) {
    onBlueprintDeselect(blueprintToAdd);

    return;
  }

  items.value.push({ blueprint: blueprintToAdd, files: [] });
}

function onBlueprintDeselect(blueprintToDeselect: IBlueprintDTO) {
  const index = items.value.findIndex(
    element => element.blueprint.id === blueprintToDeselect.id
  );

  if (~index) {
    items.value.splice(index, 1);
  }
}

function onFilesAdd(blueprintId: number, filesToAdd: IFileVariantDTO[]) {
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

  const values: IAddBundleValueDTO[] = items.value.map(item => ({
    blueprintId: item.blueprint.id,
    variantIds: item.files.map(file => file.selectedVariantId),
  }));

  try {
    await bundlesStore.add({
      values,
      note: note.value,
      expiration: expiration.value,
    });

    generalStore.messageProvider.success("Bundle successfully queued.");

    emit("update:show", false);
  } catch (error) {
    console.log(error);
  } finally {
    isSubmittingForm.value = false;
  }
}
</script>
