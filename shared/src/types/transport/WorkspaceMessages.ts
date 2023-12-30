import { IWorkspaceDTO } from "../DTOs/Workspace";
import { IAddEditWorkspaceDTO } from "../DTOs/Workspace";

export type CreateWorkspaceData = IWorkspaceDTO;

export type UpdateWorkspaceData = IAddEditWorkspaceDTO & { id: number };
