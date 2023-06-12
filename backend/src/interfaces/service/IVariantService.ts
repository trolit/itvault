import { Variant } from "@entities/Variant";

export interface IVariantService {
  getContent(variant: Variant, path: string): Promise<string>;
}
