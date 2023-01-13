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
      path: "/experiments",
      name: "experiments",
      component: () => import("../views/ExperimentsView.vue"),
      meta: {
        appearsOnTopNavigation: true,
        i18nKey: "lab",
      },
    },
  ],
});

export default router;
