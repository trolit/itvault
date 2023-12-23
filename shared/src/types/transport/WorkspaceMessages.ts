import { IWorkspaceDto } from "../dtos/Workspace";
import { AddEditWorkspaceDto } from "../dtos/AddEditWorkspaceDto";

export type CreateWorkspaceData = IWorkspaceDto;

export type UpdateWorkspaceData = AddEditWorkspaceDto & { id: number };
