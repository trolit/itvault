import type { Bucket } from "./Bucket";
import type { IBlueprintDto } from "@shared/types/dtos/Blueprint";
import type { IVariantDto } from "@shared/types/dtos/IVariantDto";

export type VariantTab = {
  variant: IVariantDto;

  content: string;

  isVisible: boolean;

  activeBlueprintId: number;

  blueprints: IBlueprintDto[];

  buckets: Bucket[];

  isWriteModeActive: boolean;
};
