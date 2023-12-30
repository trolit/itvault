import type { Bucket } from "./Bucket";
import type { IVariantDTO } from "@shared/types/dtos/Variant";
import type { IBlueprintDTO } from "@shared/types/dtos/Blueprint";

export type VariantTab = {
  variant: IVariantDTO;

  content: string;

  isVisible: boolean;

  activeBlueprintId: number;

  blueprints: IBlueprintDTO[];

  buckets: Bucket[];

  isWriteModeActive: boolean;
};
