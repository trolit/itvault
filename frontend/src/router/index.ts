import { createRouter, createWebHistory } from "vue-router";

import {
  ROUTE_ABOUT,
  ROUTE_GUIDE,
  ROUTE_UPDATES,
  ROUTE_WELCOME,
} from "@/assets/constants/routes";
import Home from "@/views/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      children: [
        {
          name: ROUTE_WELCOME,
          path: "",
          components: {
            content: () => import("@/components/pages/welcome/Index.vue"),
          },
        },
        {
          name: ROUTE_ABOUT,
          path: ROUTE_ABOUT,
          components: {
            content: () => import("@/components/pages/About.vue"),
          },
        },
        {
          name: ROUTE_GUIDE,
          path: ROUTE_GUIDE,
          components: {
            content: () => import("@/components/pages/Guide.vue"),
          },
        },
        {
          name: ROUTE_UPDATES,
          path: ROUTE_UPDATES,
          components: {
            content: () => import("@/components/pages/Updates.vue"),
          },
        },
      ],
    },
  ],
});

export default router;
