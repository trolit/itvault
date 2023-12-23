import type { IBundleFileDto } from "@shared/types/dtos/Bundle";
import type { IBlueprintDto } from "@shared/types/dtos/Blueprint";

export type BundleBlueprint = IBlueprintDto & { files: IBundleFileDto[] };
