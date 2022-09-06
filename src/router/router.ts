import {createRouter, createWebHashHistory} from "vue-router";

const routes = [
    { path: '/', component: ()=>import('../view/Home.vue') },
]
export const router=createRouter({
    history:createWebHashHistory('/'),
    routes
})