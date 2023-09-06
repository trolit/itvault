import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from "vue-router";
import { useGeneralStore } from "@/store/general";

import {
  ROUTE_GUEST_NAME,
  ROUTE_GUIDE_NAME,
  ROUTE_LOGIN_NAME,
  ROUTE_UPDATES_NAME,
  ROUTE_DASHBOARD_NAME,
  ROUTE_WORKSPACE_NAME,
} from "@/assets/constants/routes";
import Guest from "@/views/Guest.vue";
import Guide from "@/views/Guide.vue";
import Login from "@/views/Login.vue";
import Updates from "@/views/Updates.vue";
import Dashboard from "@/views/Dashboard.vue";
import Workspace from "@/views/Workspace.vue";
import { useAuthStore } from "@/store/auth";
import { LoadingState } from "@/types/enums/LoadingState";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "",
      name: ROUTE_GUEST_NAME,
      component: Guest,
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
      path: `/${ROUTE_DASHBOARD_NAME}`,
      name: ROUTE_DASHBOARD_NAME,
      component: Dashboard,
      props: {},
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: `/${ROUTE_WORKSPACE_NAME}/:slug`,
      name: ROUTE_WORKSPACE_NAME,
      component: Workspace,
      props: {},
      meta: {
        requiresAuth: true,
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
    const generalStore = useGeneralStore();

    generalStore.setLoadingState(LoadingState.Start);

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth) {
      const authStore = useAuthStore();

      try {
        await authStore.status();

        generalStore.setLoadingState(LoadingState.Finish);

        next();
      } catch (error) {
        console.error(error);

        generalStore.setLoadingState(LoadingState.Error);

        next(ROUTE_LOGIN_NAME);
      }

      return;
    }

    generalStore.setLoadingState(LoadingState.Finish);

    next();
  }
);

export default router;
