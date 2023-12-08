import { AddEditWorkspaceDto } from "../dtos/AddEditWorkspaceDto";

export type UpdateWorkspaceMessage = AddEditWorkspaceDto & { id: number };
