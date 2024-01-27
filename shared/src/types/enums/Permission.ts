export enum Permission {
  /* BLUEPRINT */
  CreateBlueprint = "BT-C",
  UpdateBlueprint = "BT-U",
  DeleteBlueprint = "BT-D",

  /* BUNDLE */
  CreateBundle = "BE-C",
  RequeueBundle = "BE-R",
  DownloadBundle = "BE-DD",
  DeleteBundle = "BE-DE",
  // @NOTE consider PatchBundleNoteController
  // @NOTE consider PatchBundleExpireController

  /* FILE */
  UploadFiles = "FE-U",
  UpdateFilename = "FE-UFN",
  MoveFiles = "FE-MVF",
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
  ManageUserWorkspaces = "UR-MUS",

  /* VARIANTS */
  CreateVariant = "VT-C",
  DeleteVariant = "VT-D",
  UpdateVariantName = "VT-UN",
  ManageVariantColoring = "VT-MC",

  /* WORKSPACE */
  ViewAllWorkspaces = "WE-VA",
  CreateWorkspace = "WE-C",
  UpdateWorkspace = "WE-U",
  ViewWorkspaceInsights = "WE-VS",
}
