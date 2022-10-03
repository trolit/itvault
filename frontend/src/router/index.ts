import { createRouter, createWebHistory } from "vue-router";

import {
  ROUTE_GUEST_NAME,
  ROUTE_GUIDE_NAME,
  ROUTE_LOGIN_NAME,
  ROUTE_UPDATES_NAME,
  ROUTE_DASHBOARD_NAME,
} from "@/assets/constants/routes";
import Guest from "@/views/Guest.vue";
import Guide from "@/views/Guide.vue";
import Login from "@/views/Login.vue";
import Updates from "@/views/Updates.vue";
import Dashboard from "@/views/Dashboard.vue";

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
    },
  ],
});

export default router;
