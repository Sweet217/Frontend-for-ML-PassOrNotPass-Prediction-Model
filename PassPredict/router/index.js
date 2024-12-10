import { createRouter, createWebHistory } from "vue-router";
import Mainpage from "../src/views/Mainpage.vue";
import Locker from "../src/views/Predicter.vue"

const routes = [
    { path: '/', name: 'Mainpage', component: Mainpage },
    { path : '/Predicter', name: 'Predicter', component: Locker}
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;