import orderBy from "lodash/orderBy";

import type { IFileDTO } from "@shared/types/dtos/File";
import type { IDirectoryDTO } from "@shared/types/dtos/Directory";

export const getUniqueTreeRelativePaths = (
  tree: (IDirectoryDTO | IFileDTO)[]
) => {
  const uniqueRelativePaths = [
    ...new Set(tree.map(({ relativePath }) => relativePath)),
  ];

  return orderBy(uniqueRelativePaths, ["asc"]);
};
