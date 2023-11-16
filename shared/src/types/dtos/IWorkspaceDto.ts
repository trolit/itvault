export interface IWorkspaceDto {
  id: number;

  name: string;

  slug: string;

  pinnedAt: string | null;

  tags: string[];
}
