export enum Permission {
  /* BLUEPRINT */
  CreateBlueprint = "BT-C",
  UpdateBlueprint = "BT-U",
  DeleteBlueprint = "BT-D",

  /* BUNDLE */
  CreateBundle = "BE-C",
  RequeueBundle = "BE-R",
  DownloadBundle = "BE-D",
  // @NOTE consider PatchBundleNoteController
  // @NOTE consider PatchBundleExpireController

  /* FILE */
  UploadFiles = "FE-U",
  UpdateFilename = "FE-UFN",
  UpdateFileRelativePath = "FE-CRPP",
  DeleteFile = "FE-D",

  /* NOTE */
  CreateNote = "NE-C",
  UpdateAnyNote = "NE-UA",
  DeleteAnyNote = "NE-DA",
  ViewDeletedNotes = "NE-VD",
  ViewUserNotes = "NE-VU",

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
  CreateVariant = "VT-C",
  DeleteVariant = "VT-D",
  UpdateVariantName = "VT-UN",
  ManageVariantColoring = "VT-MC",

  /* WORKSPACE */
  ViewAllWorkspaces = "WE-VA",
  CreateWorkspace = "WE-C",
  UpdateWorkspace = "WE-U",
}
