import { createRouter, createWebHistory } from "vue-router";

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
          name: "welcome",
          path: "",
          components: {
            content: () => import("@/components/pages/Welcome.vue"),
          },
        },
        {
          name: "about",
          path: "about",
          components: {
            content: () => import("@/components/pages/About.vue"),
          },
        },
      ],
    },
  ],
});

export default router;
