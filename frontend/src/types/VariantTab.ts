import type { IBucketDto } from "@shared/types/dtos/IBucketDto";
import type { IVariantDto } from "@shared/types/dtos/IVariantDto";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";

export type VariantTab = {
  variant: IVariantDto;

  content: string;

  isVisible: boolean;

  activeBlueprintId: number;

  blueprints: IBlueprintDto[];

  buckets: IBucketDto[];
};
