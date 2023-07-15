import uniq from "lodash/uniq";
import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { Di } from "@enums/Di";
import { AddEditWorkspaceDto } from "@dtos/AddEditWorkspaceDto";
import { IWorkspaceRepository } from "@interfaces/repositories/IWorkspaceRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { schemaForType } from "@schemas/common/schemaForType";

const getIsWorkspaceAvailableSchema = (key: "workspaceId" | "id") =>
  z.object({
    [key]: z.coerce
      .number()
      .gt(0)
      .superRefine(async (id, context: RefinementCtx) => {
        if (id <= 0) {
          return Zod.NEVER;
        }

        const workspaceRepository = getInstanceOf<IWorkspaceRepository>(
          Di.WorkspaceRepository
        );

        const workspace = await workspaceRepository.getById(id);

        if (!workspace) {
          context.addIssue({
            code: ZodIssueCode.custom,
            message: "Workspace is not available.",
          });

          return Zod.NEVER;
        }
      }),
  });

const workspaceIdSchema = schemaForType<{
  workspaceId: number;
}>()(
  z.object({
    workspaceId: z.coerce
      .number()
      .gt(0)
      .superRefine(async (id, context: RefinementCtx) => {
        if (id <= 0) {
          return Zod.NEVER;
        }

        const workspaceRepository = getInstanceOf<IWorkspaceRepository>(
          Di.WorkspaceRepository
        );

        const workspace = await workspaceRepository.getById(id);

        if (!workspace) {
          context.addIssue({
            code: ZodIssueCode.custom,
            message: "Workspace is not available.",
          });

          return Zod.NEVER;
        }
      }),
  })
);

const addEditBodySchema = schemaForType<AddEditWorkspaceDto>()(
  z.object({
    name: z
      .string()
      .min(5)
      .superRefine(async (value: string, context: RefinementCtx) => {
        if (value.length < 5) {
          return Zod.NEVER;
        }

        const workspaceRepository = getInstanceOf<IWorkspaceRepository>(
          Di.WorkspaceRepository
        );

        const workspace = await workspaceRepository.getOne({
          where: { name: value },
        });

        if (workspace) {
          context.addIssue({
            code: ZodIssueCode.custom,
            message: "This name is already taken.",
          });

          return Zod.NEVER;
        }
      }),
    tags: z
      .array(
        z
          .string()
          .min(2)
          .regex(/^[a-zA-Z0-9]*$/)
      )
      .min(1)
      .transform(value => uniq(value)),
  })
);

export const baseWorkspaceSchemas = {
  getIsWorkspaceAvailableSchema,
  workspaceIdSchema,
  addEditBodySchema,
};
