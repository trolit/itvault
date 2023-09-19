import path from "path";
import fs from "fs-extra";
import { injectable } from "tsyringe";
import { IVariantService } from "types/services/IVariantService";

import { FILES } from "@config";

import { Variant } from "@entities/Variant";

@injectable()
export class VariantService implements IVariantService {
  async getContent(variant: Variant, directory: string): Promise<string> {
    try {
      const file = await fs.readFile(
        path.join(FILES.BASE_UPLOADS_PATH, directory, variant.filename)
      );

      return file.toString();
    } catch (error) {
      console.log(error);

      return "";
    }
  }
}
