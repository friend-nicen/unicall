/*
* @author 友人a丶
* @date 2022-07-11
* 引导系统初始化
* 初始化全局响应拦截器
* 初始化路由守卫
* 初始化用户登录
* */

import loadGuard from "@/router/load-guard"
import loadInterceptor from "@/service/interceptor"
import watchRem from "./watchRem";


export default async function () {


    /**
     * 跟随屏幕大小自动调整rem
     * */
    watchRem();

    /**
     * 加载拦截器
     * */
    loadInterceptor();

    /**
     * 加载路由守卫
     * */
    loadGuard();

}
