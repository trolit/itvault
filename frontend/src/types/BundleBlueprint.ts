import type { IBundleFileDto } from "@shared/types/dtos/Bundle";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";

export type BundleBlueprint = IBlueprintDto & { files: IBundleFileDto[] };
