import { File } from "@db/entities/File";
import { Variant } from "@db/entities/Variant";
import { IEntityMapperService } from "types/services/IEntityMapperService";

import { BaseMapper } from "./BaseMapper";
import { VariantMapper } from "./VariantMapper";

import { Di } from "@enums/Di";
import { IVariantDTO } from "@shared/types/DTOs/Variant";
import { IFileVariantDTO } from "@shared/types/DTOs/File";

import { getInstanceOf } from "@helpers/getInstanceOf";

export class FileVariantMapper
  extends BaseMapper<File>
  implements IFileVariantDTO
{
  id: number;
  originalFilename: string;
  relativePath: string;
  createdAt: string;
  updatedAt: string;
  variants: IVariantDTO[];

  // @TODO consider passing mapper instance here
  constructor(data: File) {
    super(data, ["id", "originalFilename", "createdAt", "updatedAt"]);

    this.assignInitialKeys();

    const mapper = getInstanceOf<IEntityMapperService>(Di.EntityMapperService);

    if (data.directory) {
      this.relativePath = data.directory.relativePath;
    }

    if (data.variants) {
      this.variants = mapper.map<Variant>(data.variants).to(VariantMapper);
    }
  }
}
