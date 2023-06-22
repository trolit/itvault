import path from "path";
import fs from "fs-extra";
import { injectable } from "tsyringe";

import { FILES } from "@config";
import { Variant } from "@entities/Variant";
import { IVariantService } from "types/interfaces/service/IVariantService";

@injectable()
export class VariantService implements IVariantService {
  async getContent(variant: Variant, directory: string): Promise<string> {
    const file = await fs.readFile(
      path.join(FILES.BASE_UPLOADS_PATH, directory, variant.filename)
    );

    return file.toString();
  }
}
