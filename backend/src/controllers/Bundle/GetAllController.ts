import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { BundleMapDto } from "@dtos/BundleMapDto";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";
import {
  PaginatedResponse,
  ControllerImplementation,
} from "miscellaneous-types";

import { BaseController } from "@controllers/BaseController";

type Query = {
  workspaceId: number;
} & IPaginationOptions;

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetAllController extends BaseController {
  constructor(
    @inject(Di.BundleRepository)
    private _bundleRepository: IBundleRepository
  ) {
    super();
  }

  implementations: ControllerImplementation[] = [
    {
      version: v1_0,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1_0];

  async v1(
    request: CustomRequest<undefined, undefined, Query>,
    response: CustomResponse<PaginatedResponse<BundleMapDto>>
  ) {
    const {
      query: { skip, take, workspaceId },
    } = request;

    const [result, total] = await this._bundleRepository.getAll({
      skip,
      take,
      select: {
        createdBy: {
          fullName: true,
        },
      },
      where: {
        workspace: {
          id: workspaceId,
        },
      },
      relations: {
        blueprintToBundle: {
          blueprint: true,
        },
        variantToBundle: {
          variant: {
            file: true,
          },
        },
        createdBy: true,
      },
      withDeleted: true,
    });

    const mappedResult = this.mapper.mapToDto(result, BundleMapDto);

    return this.finalizeRequest(response, HTTP.OK, {
      result: mappedResult,
      total,
    });
  }
}
