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
          path: "",
          components: {
            content: () => import("@/components/Welcome.vue"),
          },
        },
      ],
    },
  ],
});

export default router;
