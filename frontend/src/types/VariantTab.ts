import type { Bucket } from "./Bucket";
import type { IVariantDto } from "@shared/types/dtos/Variant";
import type { IBlueprintDto } from "@shared/types/dtos/Blueprint";

export type VariantTab = {
  variant: IVariantDto;

  content: string;

  isVisible: boolean;

  activeBlueprintId: number;

  blueprints: IBlueprintDto[];

  buckets: Bucket[];

  isWriteModeActive: boolean;
};
