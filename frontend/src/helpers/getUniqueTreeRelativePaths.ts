import orderBy from "lodash/orderBy";

import type { IFileDto } from "@shared/types/dtos/IFileDto";
import type { IDirectoryDto } from "@shared/types/dtos/IDirectoryDto";

export const getUniqueTreeRelativePaths = (
  tree: (IDirectoryDto | IFileDto)[]
) => {
  const uniqueRelativePaths = [
    ...new Set(tree.map(({ relativePath }) => relativePath)),
  ];

  return orderBy(uniqueRelativePaths, ["asc"]);
};
