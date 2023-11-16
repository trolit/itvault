import { NoteResource } from "@shared/types/enums/NoteResource";

export const noteResourceToObject = (
  resource: NoteResource,
  id: number | string
) => {
  switch (resource) {
    case NoteResource.File: {
      return {
        file: {
          id: <number>id,
        },
      };
    }
  }
};
