/*
* @author 友人a丶
* @date 2022-07-11
* 用户退出登录
* */
/*eslint-disable*/

import user from "@/stores/user";
import Cookies from "js-cookie";
import {router} from "@/router";
import load from "@/common/load";

const quitSystem = async () => {

    /* 清空cookie */
    Object.keys(Cookies.get()).forEach((item) => {
        Cookies.remove(item);
    })

    /* 重置用户数据的状态管理器 */
    user().$reset();

    /* 跳转登录页面 */
    await router.replace('/login');

    /* 弹出提醒 */
    load.toast("登录失效");
}

/**
 * @flag，是否需要弹出提示
 **/
export default function (flag = true) {
    if (flag) {
        return load.confirm("确认退出登录吗？", quitSystem)
    } else {
        return quitSystem();
    }
}