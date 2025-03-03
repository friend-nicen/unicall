/*
* @author 友人a丶
* @date 2022-07-11
* 用户退出登录
* */
/*eslint-disable*/

import user from "@/stores/user";
import Cookies from "js-cookie";
import {router} from "@/router";
import load from "@/common/usual/load";
import config from "@/config/index"
import axios from "axios";
import api from "@/service/api";

const quitSystem = async () => {
    /*
      * 如果是cookie模式
      * */
    if (config.auth.mode === 'cookie') {

        /*
        * 访问退出登录接口
        * */
        await axios.get(api.loginOut).catch((e) => {
            /* 弹出错误原因 */
            load.error(e.message);
        });

    } else {
        /*
        * 清空cookie
        * */
        Object.keys(Cookies.get()).forEach((item) => {
            Cookies.remove(item);
        })
    }


    user().$reset(); //重置用户数据的状态管理器
    await router.replace('/login');//跳转登录页面
    load.toast_error("登录失效！"); //弹出提醒
}

/*
* @flag，是否需要弹出提示
* */
export default function (flag = true) {
    if (flag) {
        load.confirm("确认退出登录吗？", quitSystem)
    } else {
        quitSystem();
    }
}