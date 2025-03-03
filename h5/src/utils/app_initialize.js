/* eslint-disable */

/*
* @author 友人a丶
* @date 2022-07-11
*
* 初始化用户信息
* */


import load from "@/common/usual/load";
import {login} from "@/service/requests";
import user from "@/stores/user";
import system from "@/stores/system";
import detect_overlay from "@/common/html5plus/detect-overlay";
import detect_network from "@/common/html5plus/detect-network";
import plus_profill from "@/utils/plus_profill";

/*
* 初始化用户信息
* @已登录，返回登录信息
* @未登录，返回空信息
* */
export async function load_user() {

    load.loading("加载数据....");
    console.log("加载用户信息...");

    const userInfo = await login(); //请求初始化登录
    load.loaded(); //加载完毕


    /*
    * 标记系统初始化完毕
    * */
    system.init_loaded = true;//已初始化

    /*
    * 获取成功
    * 保存用户信息
    * */
    if (userInfo.code) {
        user().save(userInfo.data);
        return true;
    }


    return false;

}


/**
 * 初始化系统事件
 */
export function init_APP() {

    /*
    * 调试模式
    * */
    if (system.debug) {
        system.inited_APP = true;
        return;
    }


    /*全局监听点击回退按钮事件*/
    plus.key.addEventListener("backbutton", function () {
        load.confirm('确认要关闭软件嘛？', () => {
            plus.runtime.quit()
        });
    });

    //plus.navigator.setStatusBarStyle("light");//设置状态栏颜色

    /* 检测后台弹出 */
    if (system.detect_overlay) {
        detect_overlay(); //应用后台弹出的权限检测
    }

    /* 网络状态 */
    if (system.detect_network) {
        detect_network(); //是否是wifi
    }

    /* 应用初始化完毕 */
    system.inited_APP = true;
}


/**
 * 初始化plus
 * @return {*}
 */
export function init_plus() {

    load.loading("初始化...");

    return new Promise(resolve => {


        /*初始化plus*/
        const initialize = function () {
            system.inited_Plus = true;
            load.loaded(); //关闭加载
             plus.navigator.closeSplashscreen();
            resolve();
        }

        /*如果plus未初始化，择监听plusready事件*/
        if (typeof plus == "undefined") {
            /*
            * 调试模式
            * */
            if (system.debug) {
                plus_profill();
                initialize();
            }
            document.addEventListener("plusready", initialize);
        } else {
            initialize();
        }


    })

}



