import { Variant } from "@entities/Variant";
import { CustomRequest } from "@custom-types/express";

export interface IVariantService {
  getContent(variant: Variant, directory: string): Promise<string>;

  upload<P, B, Q>(
    request: CustomRequest<P, B, Q>,
    options: { destination?: string }
  ): Promise<Variant | null>;
}
