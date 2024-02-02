import { Bundle } from "@db/entities/Bundle";
import { inject, injectable } from "tsyringe";
import { IsNull, MoreThanOrEqual } from "typeorm";
import { BundleMapper } from "@mappers/BundleMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IBundleRepository } from "types/repositories/IBundleRepository";
import { GetAllControllerTypes } from "types/controllers/Bundle/GetAllController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1];

  async v1(
    request: GetAllControllerTypes.v1.Request,
    response: GetAllControllerTypes.v1.Response
  ) {
    const {
      query: { skip, take, workspaceId },
    } = request;

    const commonWhere = {
      workspace: {
        id: workspaceId,
      },
    };

    const [result, total] = await this._bundleRepository.getAllAndCount({
      order: {
        createdAt: "DESC",
      },
      skip,
      take,
      select: {
        createdBy: {
          id: true,
          fullName: true,
        },
      },
      where: [
        {
          expiresAt: IsNull(),
          ...commonWhere,
        },
        {
          expiresAt: MoreThanOrEqual(new Date()),
          ...commonWhere,
        },
      ],
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
    });

    const mappedResult = this.mapper.map<Bundle>(result).to(BundleMapper);

    return this.finalizeRequest(response, HTTP.OK, {
      result: mappedResult,
      total,
    });
  }
}
