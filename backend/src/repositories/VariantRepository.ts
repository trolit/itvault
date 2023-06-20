import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { Variant } from "@entities/Variant";
import { BaseRepository } from "./BaseRepository";
import { IFormDataFile } from "@interfaces/IFormDataFile";
import { IVariantRepository } from "@interfaces/repository/IVariantRepository";

@injectable()
export class VariantRepository
  extends BaseRepository<Variant>
  implements IVariantRepository
{
  protected database: Repository<Variant>;

  constructor() {
    super(Variant);
  }

  async save(
    formDataBody: {
      name: string;
      fileId: number;
      variantId?: string;
    },
    formDataFiles: IFormDataFile[]
  ): Promise<Variant | null> {
    const { name, fileId, variantId } = formDataBody;

    if (variantId) {
      const variant = await this.getById(variantId);

      return variant
        ? this.primitiveSave({
            name,
            size: variant.size,
            filename: variant.filename,
            file: {
              id: fileId,
            },
          })
        : null;
    }

    if (!formDataFiles.length) {
      return null;
    }

    const [{ file }] = formDataFiles;

    return this.primitiveSave({
      name,
      size: file.size,
      filename: file.newFilename,
      file: {
        id: fileId,
      },
    });
  }
}
