import type { IBundleFileDTO } from "@shared/types/dtos/Bundle";
import type { IBlueprintDTO } from "@shared/types/dtos/Blueprint";

export type BundleBlueprint = IBlueprintDTO & { files: IBundleFileDTO[] };
