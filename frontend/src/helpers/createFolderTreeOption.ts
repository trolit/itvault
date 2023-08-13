import { h } from "vue";
import { NIcon, type TreeOption } from "naive-ui";
import { Folder as OpenedFolderIcon } from "@vicons/carbon";

import type { IDirectoryDto } from "@shared/types/dtos/IDirectoryDto";

export default (folder: IDirectoryDto, overrides?: TreeOption) => {
  const { id, relativePath } = folder;
  const [, ...relativePathExceptRoot] = relativePath.split("/");
  const label = relativePathExceptRoot.pop();

  const folderToAdd: TreeOption = {
    key: `folder-${id}`,
    label,
    isLeaf: false,
    prefix: () =>
      h(NIcon, null, {
        default: () => h(OpenedFolderIcon),
      }),
    ...overrides,
  };

  return folderToAdd;
};
