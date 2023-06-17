import path from "path";
import fs from "fs-extra";
import { inject, injectable } from "tsyringe";

import { Di } from "@enums/Di";
import { FILES } from "@config";
import { Variant } from "@entities/Variant";
import { CustomRequest } from "@custom-types/express";
import { IBody } from "@controllers/Variant/StoreController";
import { IVariantService } from "@interfaces/service/IVariantService";
import { IVariantRepository } from "@interfaces/repository/IVariantRepository";
import { IFormidableFormFactory } from "@interfaces/factory/IFormidableFormFactory";

@injectable()
export class VariantService implements IVariantService {
  constructor(
    @inject(Di.VariantRepository)
    private _variantRepository: IVariantRepository,
    @inject(Di.FormidableFormFactory)
    private _formidableFormFactory: IFormidableFormFactory
  ) {}

  async getContent(variant: Variant, directory: string): Promise<string> {
    const file = await fs.readFile(
      path.join(FILES.STORAGE.BASE_UPLOADS_PATH, directory, variant.filename)
    );

    return file.toString();
  }

  async upload<P, Q>(
    request: CustomRequest<P, IBody, Q>,
    options: { destination?: string | undefined }
  ): Promise<Variant | null> {
    const {
      body: { fileId, variantId, name },
    } = request;

    if (variantId) {
      const variant = await this._variantRepository.getById(variantId);

      return variant
        ? this._variantRepository.primitiveSave({
            name,
            size: variant.size,
            filename: variant.filename,
            file: {
              id: fileId,
            },
          })
        : null;
    }

    const form = await this._formidableFormFactory.create({
      destination: options.destination,
      multiples: false,
    });

    return new Promise((resolve, reject) => {
      form.parse(request, async (error, fields, files) => {
        if (error) {
          reject(error);

          return;
        }

        if (!Object.keys(files).length) {
          return resolve(null);
        }

        const [, file] = Object.entries(files)[0];

        if (Array.isArray(file)) {
          return resolve(null);
        }

        const variant = await this._variantRepository.primitiveSave({
          name,
          size: file.size,
          filename: file.newFilename,
          file: {
            id: fileId,
          },
        });

        return resolve(variant);
      });
    });
  }
}
