import type { IBundleFileDTO } from "@shared/types/DTOs/Bundle";
import type { IBlueprintDTO } from "@shared/types/DTOs/Blueprint";

export type BundleBlueprint = IBlueprintDTO & { files: IBundleFileDTO[] };
