import { IWorkspaceDTO } from "../dtos/Workspace";
import { IAddEditWorkspaceDTO } from "../dtos/Workspace";

export type CreateWorkspaceData = IWorkspaceDTO;

export type UpdateWorkspaceData = IAddEditWorkspaceDTO & { id: number };
