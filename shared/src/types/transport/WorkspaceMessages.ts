import { IWorkspaceDTO, IAddEditWorkspaceDTO } from "../DTOs/Workspace";

export type CreateWorkspaceData = IWorkspaceDTO;

export type UpdateWorkspaceData = IAddEditWorkspaceDTO & { id: number };
