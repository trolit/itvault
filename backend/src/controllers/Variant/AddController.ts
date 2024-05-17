import assert from "assert";
import { inject, injectable } from "tsyringe";
import { VariantMapper } from "@mappers/VariantMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IVariantService } from "types/services/IVariantService";
import { AddControllerTypes } from "types/controllers/Variant/AddController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class AddController extends BaseController {
  constructor(
    @inject(Di.VariantService)
    private _variantService: IVariantService
  ) {
    super();
  }

  implementations: ControllerImplementation[] = [
    {
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  static readonly ALL_VERSIONS = [v1];

  async v1(
    request: AddControllerTypes.v1.Request,
    response: AddControllerTypes.v1.Response
  ) {
    const {
      body: { name, fileId },
      files,
      userId,
      query: { workspaceId },
    } = request;

    const [file] = files;

    const result = await this._variantService.save({
      name,
      file,
      workspaceId,
      author: { userId },
      variantOf: { fileId },
    });

    if (!result.isSuccess) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    assert(result.value);

    const mappedResult = this.mapper.map(result.value).to(VariantMapper);

    return this.finalizeRequest(response, HTTP.CREATED, mappedResult);
  }
}
