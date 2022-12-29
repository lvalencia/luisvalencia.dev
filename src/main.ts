import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.scss";

import { createI18n } from "vue-i18n";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import type { MessageSchema, SuppportedLocales } from "./helpers/i18n";

library.add(far);
library.add(fas);

const app = createApp(App);

app.use(createPinia());
app.use(router);

const i18n = createI18n<[MessageSchema], SuppportedLocales>({
  locale: "en-US",
  fallbackLocale: "en",
  messages: {
    en: {},
    es: {},
    ca: {},
  },
});

app.use(i18n);

app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
