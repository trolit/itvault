import orderBy from "lodash/orderBy";

import type { IFileDTO } from "@shared/types/DTOs/File";
import type { IDirectoryDTO } from "@shared/types/DTOs/Directory";

export const getUniqueTreeRelativePaths = (
  tree: (IDirectoryDTO | IFileDTO)[]
) => {
  const uniqueRelativePaths = [
    ...new Set(tree.map(({ relativePath }) => relativePath)),
  ];

  return orderBy(uniqueRelativePaths, ["asc"]);
};
