import { Resource } from "@enums/Resource";

export const resourceToEntityReference = <T>(
  resource: T,
  id: number | string
) => {
  switch (resource) {
    case Resource.File: {
      return {
        file: {
          id: <number>id,
        },
      };
    }
  }
};
