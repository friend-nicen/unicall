/*
* @author 友人a丶
* @date 2022-07-11
* 加载全局路由守卫
* */

import {init_plus, init_sys} from "@/utils/initialize";
import loadSys from '@/service/load-sys';
import setting from "@/stores/setting";
import {router} from "@/router";
import _user from "@/stores/user";
import sys from "@/stores/sys";
import config from "@/config";


/* 不需要拦截的路由配置 */
const ignoreRoute = {
    names: ['404', '403'],      //根据路由名称匹配
    paths: ['/login'],   //根据路由fullPath匹配
    /**
     * 判断路由是否包含在该配置中
     * @param route vue-router 的 route 对象
     * @returns {boolean}
     */
    includes(route) {
        return ignoreRoute.names.includes(route.name) || ignoreRoute.paths.includes(route.path)
    }
}


/**
 * 加载路由守卫
 **/
export default function () {

    console.log("加载路由守卫...");
    const user = _user();//全局状态

    /* 初始化用户信息 */
    router.beforeEach(async (to, from, next) => {
        /* 系统尚未初始化 */
        if (!sys.sys_ready) {
            console.log("初始化用户信息...");
            await loadSys();//加载用户信息初始化系统
        }
        next();
    });


    /* 初始化Plus */
    router.beforeEach(async (to, from, next) => {
        /* 系统尚未初始化 */
        if (!sys.plus_ready) {
            console.log("初始化Plus...");
            await init_plus();
        }
        next();
    });


    /* 初始化系统事件 */
    router.beforeEach(async (to, from, next) => {
        /* 系统尚未初始化 */
        if (!sys.app_ready) {
            console.log("初始化事件...");
            init_sys();
        }
        next();
    });


    /* 判断是否登录，未登录时，去登录页面 */
    router.beforeEach((to, from, next) => {

        console.log("登录判断守卫激活....")

        /* 判断是否需要拦截 */
        if (ignoreRoute.includes(to)) {
            next();
        } else {
            /* 是否已经有Token了。 */
            if (!user.token) {
                next({path: '/login'});
            } else {
                next();
            }

        }
    });

    /*
    * 切换页面标题
    * */
    router.beforeEach((to, from, next) => {
        setting()['title'] = to.meta.name;
        next();
    })


    /* 已登录时，访问登录页面，让它走 */
    router.beforeEach((to, from, next) => {
        /* 如果成功获取用户信息，跳转登录页面，则直接访问首页 */
        if (!!user.token && (to.path === "/login")) {
            next(config.index);
        } else {
            next();
        }
    });


}

