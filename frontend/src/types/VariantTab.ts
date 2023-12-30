import type { Bucket } from "./Bucket";
import type { IVariantDTO } from "@shared/types/DTOs/Variant";
import type { IBlueprintDTO } from "@shared/types/DTOs/Blueprint";

export type VariantTab = {
  variant: IVariantDTO;

  content: string;

  isVisible: boolean;

  activeBlueprintId: number;

  blueprints: IBlueprintDTO[];

  buckets: Bucket[];

  isWriteModeActive: boolean;
};
