import axios from "axios";
import { createApp } from "vue";
import { createPinia } from "pinia";
import MarkdownIt from "markdown-it";

import App from "./App.vue";
import router from "./router";
import { APP_URL } from "./config";

import "./utilities/yupLocale";
import "./assets/styles/main.css";

const app = createApp(App);

const markdown = new MarkdownIt();

app.provide("markdown", markdown);

app.use(createPinia());
app.use(router);

axios.defaults.baseURL = `${APP_URL}/api/`;

app.mount("#app");
