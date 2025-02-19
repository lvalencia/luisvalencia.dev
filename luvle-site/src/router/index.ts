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
    {
      path: "/talks",
      name: "talks",
      component: () => import("../views/TalksView.vue"),
      meta: {
        appearsOnTopNavigation: true,
        i18nKey: "talks",
      }
    },
    {
      path: "/games/cube-up",
      name: "game-cube-up",
      component: () => import("../views/games/CubeUpView.vue"),
      meta: {
        i18nKey: "cube_up",
      },
    },
    {
      path: "/games/cube-up/retro",
      name: "game-cube-up-retro",
      component: () => import("../views/retros/CubeUpView.vue"),
      meta: {
        i18nKey: "cube_up_retro",
      }, 
    }
  ],
});

export default router;
