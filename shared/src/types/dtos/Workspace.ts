export interface IWorkspaceDto {
  id: number;

  name: string;

  description: string;

  slug: string;

  pinnedAt: string | null;

  tags: string[];
}
