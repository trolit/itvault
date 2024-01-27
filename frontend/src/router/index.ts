import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from "vue-router";
import { useDrawerStore } from "@/store/drawer";
import { useGeneralStore } from "@/store/general";

import {
  ROUTE_GUEST_NAME,
  ROUTE_GUIDE_NAME,
  ROUTE_LOGIN_NAME,
  ROUTE_ROLES_NAME,
  ROUTE_USERS_NAME,
  ROUTE_SIGN_UP_NAME,
  ROUTE_UPDATES_NAME,
  ROUTE_INSIGHTS_NAME,
  ROUTE_SETTINGS_NAME,
  ROUTE_DASHBOARD_NAME,
  ROUTE_WORKSPACES_NAME,
} from "@/assets/constants/routes";

import Guest from "@/views/Guest.vue";
import Guide from "@/views/Guide.vue";
import Login from "@/views/Login.vue";
import Roles from "@/views/Roles.vue";
import Users from "@/views/Users.vue";
import SignUp from "@/views/SignUp.vue";
import Updates from "@/views/Updates.vue";
import Settings from "@/views/Settings.vue";
import Dashboard from "@/views/Dashboard.vue";
import WorkspaceTab from "@/views/Workspace/[tab].vue";
import WorkspaceInsights from "@/views/Workspace/Insights.vue";

import { useAuthStore } from "@/store/auth";
import { LoadingState } from "@/types/enums/LoadingState";
import { Permission } from "@shared/types/enums/Permission";
import { GENERAL_LAYOUT_SIDER_KEYS } from "@/config/constants";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: ROUTE_GUEST_NAME,
      component: Guest,
    },

    {
      path: `/${ROUTE_GUEST_NAME}/${ROUTE_SIGN_UP_NAME}`,
      name: ROUTE_SIGN_UP_NAME,
      component: SignUp,
    },

    {
      path: `/${ROUTE_LOGIN_NAME}`,
      name: ROUTE_LOGIN_NAME,
      component: Login,
    },

    {
      path: `/${ROUTE_GUIDE_NAME}`,
      name: ROUTE_GUIDE_NAME,
      component: Guide,
    },

    {
      path: `/${ROUTE_UPDATES_NAME}`,
      name: ROUTE_UPDATES_NAME,
      component: Updates,
    },

    {
      path: `/${ROUTE_SETTINGS_NAME}`,
      name: ROUTE_SETTINGS_NAME,
      component: Settings,
      props: {},
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: `/${ROUTE_DASHBOARD_NAME}`,
      name: ROUTE_DASHBOARD_NAME,
      component: Dashboard,
      props: {},
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: `/${ROUTE_WORKSPACES_NAME}/:slug/:tab(${GENERAL_LAYOUT_SIDER_KEYS.BLUEPRINTS_TAB}|${GENERAL_LAYOUT_SIDER_KEYS.BUNDLES_TAB}|${GENERAL_LAYOUT_SIDER_KEYS.FILES_TAB})`,
      name: ROUTE_WORKSPACES_NAME,
      component: WorkspaceTab,
      props: {},
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: `/${ROUTE_WORKSPACES_NAME}/:slug/${ROUTE_INSIGHTS_NAME}`,
      name: ROUTE_INSIGHTS_NAME,
      component: WorkspaceInsights,
      props: {},
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: `/${ROUTE_USERS_NAME}`,
      name: ROUTE_USERS_NAME,
      component: Users,
      props: {},
      meta: {
        requiresAuth: true,
        requiresOneOfPermissions: [Permission.ViewAllUsers],
      },
    },

    {
      path: `/${ROUTE_ROLES_NAME}`,
      name: ROUTE_ROLES_NAME,
      component: Roles,
      props: {},
      meta: {
        requiresAuth: true,
        requiresOneOfPermissions: [
          Permission.CreateRole,
          Permission.UpdateRole,
        ],
      },
    },
  ],
});

router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    if (!to.matched.length) {
      next("/");

      return;
    }

    const drawerStore = useDrawerStore();
    const generalStore = useGeneralStore();

    generalStore.setLoadingState(LoadingState.Start);

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    // @NOTE consider testing "to.matched.length" (if equals 1) to eliminate wrong permissions check possibility (?)

    if (requiresAuth) {
      const authStore = useAuthStore();

      try {
        await authStore.status();

        const requiresOneOfPermissions = <Permission[] | undefined>(
          to.meta.requiresOneOfPermissions
        );

        if (
          requiresOneOfPermissions &&
          !authStore.hasAtLeastOnePermission(requiresOneOfPermissions)
        ) {
          throw Error("Insufficient permissions to access the page!");
        }

        drawerStore.setActiveDrawer(null);

        generalStore.setLoadingState(LoadingState.Finish);

        next();
      } catch (error) {
        console.error(error);

        generalStore.setLoadingState(LoadingState.Error);

        next(ROUTE_LOGIN_NAME);
      }

      return;
    }

    drawerStore.setActiveDrawer(null);

    generalStore.setLoadingState(LoadingState.Finish);

    next();
  }
);

export default router;
