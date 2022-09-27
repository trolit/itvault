import { createRouter, createWebHistory } from "vue-router";

import {
  ROUTE_ABOUT_NAME,
  ROUTE_GUIDE_NAME,
  ROUTE_UPDATES_NAME,
  ROUTE_DASHBOARD_NAME,
} from "@/assets/constants/routes";
import About from "@/views/About.vue";
import Guide from "@/views/Guide.vue";
import Updates from "@/views/Updates.vue";
import Dashboard from "@/views/Dashboard.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: ROUTE_DASHBOARD_NAME,
    },
    {
      path: `/${ROUTE_ABOUT_NAME}`,
      name: ROUTE_ABOUT_NAME,
      component: About,
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
