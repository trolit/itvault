import { injectable } from "tsyringe";
import { IFormDataFile } from "types/IFormDataFile";
import { IVariantRepository } from "types/repositories/IVariantRepository";

import { BaseRepository } from "./BaseRepository";

import { Variant } from "@entities/Variant";

@injectable()
export class VariantRepository
  extends BaseRepository<Variant>
  implements IVariantRepository
{
  constructor() {
    super(Variant);
  }

  async save(
    userId: number,
    formDataBody: {
      name: string;
      fileId: number;
    },
    formDataFiles: IFormDataFile[]
  ): Promise<Variant | null> {
    const { name, fileId } = formDataBody;

    const partialEntity = this.createEntity({
      name,
      file: {
        id: fileId,
      },
      createdBy: {
        id: userId,
      },
    });

    const [{ file }] = formDataFiles;

    return this.primitiveSave({
      ...partialEntity,
      size: file.size,
      filename: file.newFilename,
    });
  }
}
