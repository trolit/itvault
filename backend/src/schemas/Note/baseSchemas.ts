import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { NoteDto } from "@dtos/NoteDto";
import { Resource } from "@enums/Resource";
import { IBaseRepository } from "@interfaces/repositories/IBaseRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { schemaForType } from "@schemas/common/schemaForType";

type ResourceRequest = Pick<NoteDto, "id" | "resource">;

const resourceSchema = schemaForType<ResourceRequest>()(
  z
    .object({
      id: z.coerce.number().gt(0),

      resource: z.nativeEnum(Resource),
    })
    .superRefine(async (value: ResourceRequest, context: RefinementCtx) => {
      const { id, resource: resourceName } = value;

      if (!Resource[resourceName]) {
        return Zod.NEVER;
      }

      const repository = getInstanceOf<IBaseRepository<unknown>>(
        `I${resourceName}Repository`
      );

      const entity = await repository.getById(id);

      if (!entity) {
        context.addIssue({
          code: ZodIssueCode.custom,
          message: `${resourceName} is not available.`,
        });

        return Zod.NEVER;
      }
    })
);

export const baseSchemas = {
  resourceSchema,
};
