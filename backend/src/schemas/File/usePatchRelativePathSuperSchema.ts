import { object, string } from "yup";
import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { PatchRelativePathControllerTypes } from "types/controllers/File/PatchRelativePathController";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchemaElement<PatchRelativePathControllerTypes.v1.Params> =
  object({
    fileId: useIdNumberSchema(Di.FileRepository),
  });

const querySchema: SuperSchemaElement<PatchRelativePathControllerTypes.v1.Query> =
  object({
    workspaceId: useIdNumberSchema(Di.WorkspaceRepository),
  });

const bodySchema: SuperSchemaElement<PatchRelativePathControllerTypes.v1.Body> =
  object({
    relativePath: string()
      .trim()
      .required()
      .matches(/^[a-zA-Z0-9/._-]+$/)
      .test((value: string, ctx) => {
        if (value.includes("//")) {
          return ctx.createError({
            message: "Double slash is forbidden.",
          });
        }

        if (value.split(".").length !== 2) {
          return ctx.createError({
            message:
              "Relative path should only contain one root indicator (dot).",
          });
        }

        if (value.includes("/") && !value.startsWith(".")) {
          return ctx.createError({
            message: "Relative path should start with root indicator (dot).",
          });
        }

        return true;
      }),
  });

export const usePatchRelativePathSuperSchema: SuperSchemaRunner<
  PatchRelativePathControllerTypes.v1.Params,
  PatchRelativePathControllerTypes.v1.Body,
  PatchRelativePathControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
    params: paramsSchema,
    body: bodySchema,
  };
});
