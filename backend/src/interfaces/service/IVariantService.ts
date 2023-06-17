import { Variant } from "@entities/Variant";
import { CustomRequest } from "@custom-types/express";
import { IBody } from "@controllers/Variant/StoreController";

export interface IVariantService {
  getContent(variant: Variant, directory: string): Promise<string>;

  upload<P, Q>(
    request: CustomRequest<P, IBody, Q>,
    options: { destination?: string }
  ): Promise<Variant | null>;
}
