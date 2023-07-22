export enum Permission {
  /* ROLE */
  ViewAllRoles = "RE-VAP",
  CreateRole = "RE-CP",
  UpdateRole = "RE-UP",

  /* WORKSPACE */
  ViewAllWorkspaces = "WE-VAP",
  CreateWorkspace = "WE-CP",
  UpdateWorkspace = "WE-UP",

  /* BLUEPRINT */
  CreateBlueprint = "BT-CP",

  /* USER */
  ViewAllUsers = "UR-VAP",
  ChangeUserRole = "UR-CRP",
  RestoreUserAccount = "UR-RAP",
  DeactivateUserAccount = "UR-DAP",

  /* FILE */
  UploadFiles = "FE-UP",
  RemoveFile = "FE-RP",
  UpdateFilename = "FE-UFNP",
  UpdateFileRelativePath = "FE-CRPP",
}
