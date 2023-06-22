export enum Permission {
  ViewAllRoles = 1,
  CreateRole,
  UpdateRole,

  ViewAllWorkspaces,
  CreateWorkspace,
  UpdateWorkspace,

  ViewAllUsers,
  ChangeUserRole,
  RestoreUserAccount,
  DeactivateUserAccount,

  UploadFiles,
  RemoveFile,
  UpdateFilename,
  UpdateFileRelativePath,
}
