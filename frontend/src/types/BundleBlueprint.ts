import type { IBundleFileDto } from "@shared/types/dtos/IBundleFileDto";
import type { IBundleBlueprintDto } from "@shared/types/dtos/IBundleBlueprintDto";

export type BundleBlueprint = IBundleBlueprintDto & { files: IBundleFileDto[] };
