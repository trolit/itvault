import { object, string } from "yup";

import { useResourceEntityTest } from "./useResourceEntityTest";

import { NOTE_RULES } from "@shared/constants/rules";
import { NoteResource } from "@shared/types/enums/NoteResource";

import { useTextSchema } from "@schemas/common/useTextSchema";

export const addEditBodySchema = object({
  id: useResourceEntityTest(),
  text: useTextSchema(NOTE_RULES.VALUE.MAX_LENGTH),
  resource: string().required().oneOf([NoteResource.File]),
});
