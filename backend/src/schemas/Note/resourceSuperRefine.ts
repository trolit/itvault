import Zod, { RefinementCtx, ZodIssueCode } from "zod";

import { NoteDto } from "@dtos/NoteDto";
import { Resource } from "@enums/Resource";
import { IBaseRepository } from "@interfaces/repositories/IBaseRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

type Value = Pick<NoteDto, "id" | "resource">;

export const resourceSuperRefine = async (
  value: Value,
  context: RefinementCtx
) => {
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
};
