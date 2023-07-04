import { Resource } from "@enums/Resource";

export const resourceToEntityReference = <T>(resource: T, id: number) => {
  switch (resource) {
    case Resource.File: {
      return {
        file: {
          id,
        },
      };
    }
  }
};
