import { h } from "vue";
import { NIcon, type TreeOption } from "naive-ui";
import { Document as FileIcon } from "@vicons/carbon";

import type { IFileDto } from "@shared/types/dtos/File";

export default (file: IFileDto, overrides?: TreeOption) => {
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
