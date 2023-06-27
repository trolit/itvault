import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { BaseRepository } from "./BaseRepository";

import { Variant } from "@entities/Variant";
import { IFormDataFile } from "@interfaces/IFormDataFile";
import { IVariantRepository } from "@interfaces/repositories/IVariantRepository";

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
    userId: number,
    formDataBody: {
      name: string;
      fileId: number;
      variantId?: string;
    },
    formDataFiles: IFormDataFile[]
  ): Promise<Variant | null> {
    const { name, fileId, variantId } = formDataBody;

    const partialEntity = this.createEntity({
      name,
      file: {
        id: fileId,
      },
      createdBy: {
        id: userId,
      },
    });

    if (variantId) {
      const variant = await this.getById(variantId);

      return variant
        ? this.primitiveSave({
            ...partialEntity,
            size: variant.size,
            filename: variant.filename,
          })
        : null;
    }

    const [{ file }] = formDataFiles;

    return this.primitiveSave({
      ...partialEntity,
      size: file.size,
      filename: file.newFilename,
    });
  }
}
