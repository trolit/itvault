import path from "path";

export const TESTS_TIMEOUT = "10s";
export const RUNTIME_DATA_DI_TOKEN = "IRuntimeData";
export const PATH_TO_CONTROLLERS_TESTS = path.join(__dirname, "controllers");

export const ROUTER_VERSION_PREFIX = "v";

export const WORKSPACE_1 = {
  id: 1,
  name: "Workspace1",
  description: "This is description of Workspace1",
};

export const WORKSPACE_2 = {
  id: 2,
  name: "Workspace2",
  description: "This is description of Workspace2",
};

export const BLUEPRINT_1 = {
  id: 1,
  name: "This is blueprint1",
  color: "#B0B0B2",
  description: "Blueprint1 description is quite typical.",
  workspaceId: WORKSPACE_1.id,
};

export const BLUEPRINT_2 = {
  id: 2,
  name: "This is blueprint2",
  color: "#E2FD07",
  description: "Blueprint2 description is quite typical.",
  workspaceId: WORKSPACE_1.id,
};

export const UNEXISTING_WORKSPACE_ID = 9999;
export const UNEXISTING_BLUEPRINT_ID = 9999;
