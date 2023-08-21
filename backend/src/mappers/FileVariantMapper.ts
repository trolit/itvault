import { IEntityMapperService } from "types/services/IEntityMapperService";

import { BaseMapper } from "./BaseMapper";
import { VariantMapper } from "./VariantMapper";

import { Di } from "@enums/Di";
import { File } from "@entities/File";
import { Variant } from "@entities/Variant";
import { IVariantDto } from "@shared/types/dtos/IVariantDto";
import { IFileVariantDto } from "@shared/types/dtos/IFileVariantDto";

import { getInstanceOf } from "@helpers/getInstanceOf";

export class FileVariantMapper
  extends BaseMapper<File>
  implements IFileVariantDto
{
  id: number;
  originalFilename: string;
  relativePath: string;
  createdAt: string;
  updatedAt: string;
  variants: IVariantDto[];

  // @TODO consider passing mapper instance here
  constructor(
    data: File,
    keys: (keyof File)[] = ["id", "originalFilename", "createdAt", "updatedAt"]
  ) {
    super(data, keys);

    const mapper = getInstanceOf<IEntityMapperService>(Di.EntityMapperService);

    if (data.directory) {
      this.relativePath = data.directory.relativePath;
    }

    if (data.variants) {
      this.variants = mapper.map<Variant>(data.variants).to(VariantMapper);
    }

    return this;
  }
}
