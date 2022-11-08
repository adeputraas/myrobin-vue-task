import { createApp } from "vue";
import { createPinia } from "pinia";

import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);
app.config.globalProperties.$socketio = io("http://localhost:3030", {
  transports: ["websocket"],
});
app.use(createPinia());
app.use(router);

app.mount("#app");
