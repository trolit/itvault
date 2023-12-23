import { IWorkspaceDto } from "../dtos/Workspace";
import { IAddEditWorkspaceDto } from "../dtos/Workspace";

export type CreateWorkspaceData = IWorkspaceDto;

export type UpdateWorkspaceData = IAddEditWorkspaceDto & { id: number };
