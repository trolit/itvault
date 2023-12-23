export interface IWorkspaceDto {
  id: number;

  name: string;

  description: string;

  slug: string;

  pinnedAt: string | null;

  tags: string[];
}

export interface IAddEditWorkspaceDto {
  name: string;

  description: string;

  tags: string[];
}
