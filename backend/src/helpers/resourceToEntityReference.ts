import { Resource } from "@enums/Resource";

export const resourceToEntityReference = (resource: Resource, id: number) => {
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
