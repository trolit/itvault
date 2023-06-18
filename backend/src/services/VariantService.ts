import path from "path";
import fs from "fs-extra";
import { inject, injectable } from "tsyringe";

import { Di } from "@enums/Di";
import { FILES } from "@config";
import { Variant } from "@entities/Variant";
import { CustomRequest } from "@custom-types/express";
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
      path.join(FILES.BASE_UPLOADS_PATH, directory, variant.filename)
    );

    return file.toString();
  }

  async upload<P, B, Q>(
    request: CustomRequest<P, B, Q>,
    options: { destination?: string | undefined }
  ): Promise<Variant | null> {
    const form = await this._formidableFormFactory.create({
      basePath: FILES.BASE_UPLOADS_PATH,
      destination: options.destination,
      multiples: false,
    });

    return new Promise((resolve, reject) => {
      form.parse(request, async (error, fields, files) => {
        const { name, fileId, variantId } = fields;

        if (error) {
          reject(error);

          return;
        }

        if (
          Array.isArray(name) ||
          Array.isArray(fileId) ||
          Array.isArray(variantId)
        ) {
          return resolve(null);
        }

        if (variantId) {
          const variant = await this._variantRepository.getById(variantId);

          return resolve(
            variant
              ? this.saveVariant({
                  name,
                  fileId,
                  size: variant.size,
                  filename: variant.filename,
                })
              : null
          );
        }

        if (!Object.keys(files).length) {
          return resolve(null);
        }

        const [, file] = Object.entries(files)[0];

        if (Array.isArray(file)) {
          return resolve(null);
        }

        return resolve(
          this.saveVariant({
            name,
            fileId,
            size: file.size,
            filename: file.newFilename,
          })
        );
      });
    });
  }

  private saveVariant(options: {
    name: string;
    size: number;
    filename: string;
    fileId: string;
  }) {
    const { name, size, filename, fileId } = options;

    return this._variantRepository.primitiveSave({
      name,
      size,
      filename,
      file: {
        id: parseInt(fileId),
      },
    });
  }
}
