import { object, string } from "yup";
import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { PatchRelativePathControllerTypes } from "types/controllers/File/PatchRelativePathController";

import { FILES } from "@config";

import { Di } from "@enums/Di";

import { setYupError } from "@helpers/yup/setError";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchemaElement<PatchRelativePathControllerTypes.v1.Params> =
  object({
    id: useIdNumberSchema(Di.FileRepository),
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

        if (value.split(FILES.ROOT).length !== 2) {
          return ctx.createError({
            message: setYupError(CUSTOM_MESSAGES.FILE.ONLY_ONE_ROOT_INDICATOR),
          });
        }

        if (value.includes("/") && !value.startsWith(FILES.ROOT)) {
          return ctx.createError({
            message: setYupError(
              CUSTOM_MESSAGES.FILE.SHOULD_START_WITH_ROOT_INDICATOR
            ),
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
