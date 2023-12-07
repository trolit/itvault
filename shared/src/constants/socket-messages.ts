// [SECTION]
//    TYPE - message (FE -> BE)
//    OUT - possible messages (BE -> FE))

export default {
  VIEW_DASHBOARD: {
    TYPE: "view-dashboard",
    ACTIONS: {
      CREATE_WORKSPACE: "create-workspace",
      UPDATE_WORKSPACE: "update-workspace",
      DELETE_WORKSPACE: "delete-workspace",
    },
  },

  VIEW_WORKSPACE: {
    TYPE: "view-workspace",
    ACTIONS: {
      CREATE_BLUEPRINT: "create-blueprint",
      UPDATE_BLUEPRINT: "update-blueprint",
      DELETE_BLUEPRINT: "delete-blueprint",
    },
  },
};
