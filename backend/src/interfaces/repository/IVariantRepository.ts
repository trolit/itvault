import { Variant } from "@entities/Variant";
import { IBaseRepository } from "./IBaseRepository";
import { IFormDataFile } from "@interfaces/IFormDataFile";

export interface IVariantRepository extends IBaseRepository<Variant> {
  save(
    formDataBody: {
      name: string;
      fileId: number;
      variantId?: string;
    },
    formDataFiles: IFormDataFile[]
  ): Promise<Variant | null>;
}
