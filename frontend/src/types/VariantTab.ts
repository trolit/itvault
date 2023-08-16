import type { IVariantDto } from "@shared/types/dtos/IVariantDto";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";

export type VariantTab = {
  value: IVariantDto;

  content: string;

  isVisible: boolean;

  activeBlueprintId: number;

  blueprints: IBlueprintDto[];
};
