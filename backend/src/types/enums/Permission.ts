export enum Permission {
  /* BLUEPRINT */
  CreateBlueprint = "BT-C",
  UpdateBlueprint = "BT-U",
  DeleteBlueprint = "BT-D",

  /* BUNDLE */
  CreateBundle = "BE-C",
  RequeueBundle = "BE-R",
  UpdateBundle = "BE-U", // @TODO endpoint
  DownloadBundle = "BE-D",

  /* FILE */
  UploadFiles = "FE-U",
  UpdateFilename = "FE-UFN", // @TODO endpoint
  UpdateFileRelativePath = "FE-CRPP",
  DeleteFile = "FE-D", // @TODO endpoint

  /* NOTE */
  CreateNote = "NE-C",
  UpdateAnyNote = "NE-UA", // @TODO adjust validator
  DeleteAnyNote = "NE-DA", // @TODO adjust validator
  ViewDeletedNotes = "NE-VD", // @TODO adjust endpoint

  /* ROLE */
  CreateRole = "RE-C",
  UpdateRole = "RE-U",

  /* USER */
  ViewAllUsers = "UR-VAP",
  CreateUser = "UR-C",
  ChangeUserRole = "UR-CR",
  RestoreUserAccount = "UR-RA",
  DeactivateUserAccount = "UR-DA",

  /* VARIANTS */
  CreateVariant = "VT-C", // @TODO
  UpdateVariant = "VT-U", // @TODO
  DeleteVariant = "VT-D", // @TODO
  ManageVariantColoring = "VT-MC", // @TODO

  /* WORKSPACE */
  ViewAllWorkspaces = "WE-VA",
  CreateWorkspace = "WE-C",
  UpdateWorkspace = "WE-U",
}
