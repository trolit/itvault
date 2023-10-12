import { NoteResource } from "@shared/types/enums/NoteResource";

export const resourceToEntityReference = <T>(
  resource: T,
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
