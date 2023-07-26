import Zod, { RefinementCtx, ZodIssueCode } from "zod";

import { AddEditNoteDto } from "@dtos/AddEditNoteDto";
import { CommentableResource } from "@enums/CommentableResource";
import { IBaseRepository } from "@interfaces/repositories/IBaseRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

type Value = Pick<AddEditNoteDto, "id" | "resource">;

export const resourceSuperRefine = async (
  value: Value,
  context: RefinementCtx
) => {
  const { id, resource: resourceName } = value;

  if (!CommentableResource[resourceName] || id <= 0) {
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
