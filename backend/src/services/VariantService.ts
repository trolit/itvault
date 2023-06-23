import path from "path";
import fs from "fs-extra";
import { FILES } from "@config";
import { injectable } from "tsyringe";

import { Variant } from "@entities/Variant";
import { IVariantService } from "@interfaces/services/IVariantService";

@injectable()
export class VariantService implements IVariantService {
  async getContent(variant: Variant, directory: string): Promise<string> {
    const file = await fs.readFile(
      path.join(FILES.BASE_UPLOADS_PATH, directory, variant.filename)
    );

    return file.toString();
  }
}
