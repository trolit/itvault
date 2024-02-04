import { Action } from "../enums/Action";

export interface IWorkspaceEventDTO {
  id: number;

  entity: string;

  action: Action;

  targetId: string;

  createdAt: string;

  createdBy: { id: number; fullName: string };
}
