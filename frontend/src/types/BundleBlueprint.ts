import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";
import type { IBundleFileDto } from "@shared/types/dtos/IBundleFileDto";

export type BundleBlueprint = IBlueprintDto & { files: IBundleFileDto[] };
