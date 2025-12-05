/* eslint-disable */

/*
* @author 友人a丶
* @date 2022-07-11
* 初始化用户信息
* */


import load from "@/common/load";
import {login} from "@/service/requests";
import user from "@/stores/user";
import sys from "@/stores/sys";
import profill from "@/utils/profill";
import {router} from "@/router";

/*
* 初始化用户信息
* @已登录，返回登录信息
* @未登录，返回空信息
* */
export async function load_user() {

    load.loading("加载数据....");
    console.log("加载用户信息...");

    /* 请求初始化登录 */
    const userInfo = await login();
    load.loaded();

    /* 标记系统初始化完毕 */
    sys.sys_ready = true;

    /* 保存用户信息 */
    if (userInfo.code) {
        user().save(userInfo.data.user);
        return true;
    }

    return false;

}


/**
 * 初始化系统事件
 */
export function init_sys() {

    /* 调试模式 */
    if (sys.debug) {
        sys.app_ready = true;
        return;
    }


    /* 全局监听点击回退按钮事件 */
    plus.key.addEventListener("backbutton", function () {
        if (location.hash.indexOf('browser') > -1) {
            router.back();
        } else {
            load.confirm('确认要退出应用嘛？', () => {
                plus.runtime.quit()
            });
        }

    });

    /* 应用初始化完毕 */
    sys.app_ready = true;
}


/**
 * 初始化plus
 * @return {*}
 */
export function init_plus() {

    load.loading("初始化...");

    return new Promise(resolve => {

        /* 初始化plus */
        const initialize = function () {
            sys.plus_ready = true;
            load.loaded();
            plus.navigator.closeSplashscreen();
            resolve();
        }

        /* 如果plus未初始化，择监听plusready事件 */
        if (typeof plus == "undefined") {
            /* 调试模式 */
            if (sys.debug) {
                profill();
                initialize();
            }
            document.addEventListener("plusready", initialize);
        } else {
            initialize();
        }
    });
}



