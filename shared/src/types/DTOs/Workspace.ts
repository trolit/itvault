import { Action } from "../enums/Action";

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

export interface IWorkspaceEventDTO {
  id: number;

  entity: string;

  action: Action;

  targetId: string;

  createdAt: string;

  createdBy: { id: number; fullName: string };
}

export interface IWorkspaceActivityDataPointDTO {
  x: string;

  y: number;
}
