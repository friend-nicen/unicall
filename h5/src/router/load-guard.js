/*
* @author 友人a丶
* @date 2022-07-11
*
* 加载全局路由守卫
* */


import {router} from "@/router";
import userStore from "@/stores/user";
import system from "@/stores/system";
import config from "@/config";
import {load_user, init_plus, init_APP} from "@/utils/app_initialize";
import setting from "@/stores/setting";


// 不需要拦截的路由配置
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


/*
* 加载路由守卫
* */
export default function () {

    console.log("加载路由守卫...");
    const userInfo = userStore();//全局状态

    /*
    * 初始化用户信息
    * */
    router.beforeEach(async (to, from, next) => {
        /* 系统尚未初始化 */
        if (!system.init_loaded) {
            console.log("初始化用户信息...");
            await load_user();//加载用户信息初始化系统
        }
        next(); //下一个
    });


    /*
    * 初始化Plus
    * */
    router.beforeEach(async (to, from, next) => {
        /* 系统尚未初始化 */
        if (!system.inited_Plus) {
            console.log("初始化Plus...");
            await init_plus();//加载用户信息初始化系统
        }
        next(); //下一个
    });


    /*
    * 初始化系统事件
    * */
    router.beforeEach(async (to, from, next) => {
        /* 系统尚未初始化 */
        if (!system.inited_APP) {
            console.log("初始化事件...");
            init_APP();//加载用户信息初始化系统
        }
        next(); //下一个
    });


    /*
    * 判断是否登录，未登录时，去登录页面
    * */
    router.beforeEach((to, from, next) => {

        console.log("登录判断守卫激活....")


        /*
        * 判断是否需要拦截
        * */
        if (ignoreRoute.includes(to)) {
            next();
        } else {
            /*
            * 是否已经有Token了。
            * */
            if (!userInfo.basic.token) {
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
        setting()['doc_title'] = to.meta.name;
        next();
    })


    /*
    * 已登录时，访问登录页面，让它走
    * */
    router.beforeEach((to, from, next) => {
        /* 如果成功获取用户信息，跳转登录页面，则直接访问首页 */
        if (!!userInfo.basic.token && (to.path == "/login")) {
            next(config.index);
        } else {
            next(); //下一个
        }
    });


}

