export interface IWorkspaceDTO {
  id: number;

  name: string;

  description: string;

  slug: string;

  pinnedAt: string | null;

  tags: string[];
}

export interface IAddEditWorkspaceDTO {
  name: string;

  description: string;

  tags: string[];
}
