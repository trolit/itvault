import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { AddControllerTypes } from "types/controllers/Note/AddController";

import { Di } from "@enums/Di";
import { NOTE_RULES } from "@shared/constants/rules";

import { useTextSchema } from "@schemas/common/useTextSchema";
import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const { MIN_LENGTH, MAX_LENGTH } = NOTE_RULES.VALUE;

const querySchema: SuperSchema.Fragment<AddControllerTypes.v1.Query> = object({
  workspaceId: number().required(),
});

const bodySchema: SuperSchema.Fragment<AddControllerTypes.v1.Body> = object({
  text: useTextSchema(MIN_LENGTH, MAX_LENGTH),
  fileId: useIdNumberSchema(Di.FileRepository),
});

export const useAddSuperSchema: SuperSchema.Runner<
  void,
  AddControllerTypes.v1.Body,
  AddControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
    body: bodySchema,
  };
});
