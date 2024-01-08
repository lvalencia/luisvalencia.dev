import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        appearsOnTopNavigation: true,
        i18nKey: "home",
      },
    },
    {
      path: "/games",
      name: "games",
      component: () => import("../views/GamesView.vue"),
      meta: {
        appearsOnTopNavigation: true,
        i18nKey: "games",
      },
    },
  ],
});

export default router;
