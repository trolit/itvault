import { Variant } from "@entities/Variant";

export interface IVariantService {
  getContent(variant: Variant, directory: string): Promise<string>;
}
