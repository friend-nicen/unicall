/*引入vue-*/
import {createRouter, createWebHashHistory} from "vue-router"
import config from "@/config";
import MainLayout from '@/layouts/main-layout.vue'
import {getChildrens} from '@/router/common'

const children = getChildrens();

const basic = [
    {
        path: "/",
        redirect: config.index,
        component: MainLayout,
        meta: {
            cache_1: '/',
        },
        children: children.应用.default({cache_1: '/'})
    },
    {
        path: "/login",
        meta: {
            role: false,
            name: "登录",
            cache_1: 'login'
        },
        component: () => import("@/pages/login"),
    },
    {
        path: '/403',
        meta: {
            role: false,
            name: '403',
            cache_1: '403'
        },
        component: () => import('@/components/v-error.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        meta: {
            role: false,
            name: '404',
            cache_1: '404'
        },
        component: () => import('@/components/v-error.vue'),
    }
];


/*路由配置项*/
export const router = createRouter({
    history: createWebHashHistory(),
    routes: basic
});
