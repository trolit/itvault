import { h } from "vue";
import { NIcon, type TreeOption } from "naive-ui";
import { Document as FileIcon } from "@vicons/carbon";

import type { IFileDTO } from "@shared/types/DTOs/File";

export default (file: IFileDTO, overrides?: TreeOption) => {
  const { id } = file;

  const fileToAdd: TreeOption = {
    key: `file-${id}`,
    label: file.originalFilename,
    isLeaf: true,
    children: undefined,
    prefix: () =>
      h(NIcon, null, {
        default: () => h(FileIcon),
      }),
    ...overrides,
  };

  return fileToAdd;
};
