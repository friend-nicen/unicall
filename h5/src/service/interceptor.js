/*
* @author 友人a丶
* @date 2022-07-11
* 加载axio拦截器
* */
import axios from "axios";
import load from "@/common/load";
import api from '@/service/api';
import quitSystem from './quit-system'
import config from "@/config";
import user from "@/stores/user";

/* 是否需要注册认证头 */
if (config.auth.mode === "token") {
    const xsrfHeaderName = config.auth.token;
    axios.defaults.timeout = 60000;
    axios.defaults.xsrfHeaderName = xsrfHeaderName;
    axios.defaults.xsrfCookieName = xsrfHeaderName;
}

/* 不需要拦截的接口 */
const ignoreApi = {
    api: [
        api.login
    ],
    /* 判断当前请求的接口是否在忽略列表 */
    includes(use_api) {
        for (let item of ignoreApi.api) {
            let reg = new RegExp(`.*${item}.*`);
            if (reg.test(use_api)) {
                return true;
            }
        }
        return false;
    }
}

/**
 * 注册拦截器
 **/
export default function () {

    console.log("加载拦截器...");

    let timer = null; //计时器

    axios.interceptors.response.use((res) => {

        console.log("请求接口：" + res.config.url)
        console.log(res);

        /* 判断是否需要拦截 */
        if (ignoreApi.includes(res.config.url)) {
            return res;
        }


        /* 如果是401(没有token/token过期) 就跳转登录界面重新登录 */
        if (res.data.code === -1) {
            /* 转换为正常失败代码 */
            res.data.code = 0;
            /* 清理未执行的定时器 */
            clearTimeout(timer);
            /* 延时器 */
            timer = setTimeout(() => {
                /* 清理定时器 */
                user().$reset();
                clearTimeout(timer);
                /* 弹出提示 */
                load.confirm("当前登录状态已失效，请您重新登录", () => {
                    quitSystem(false);
                });
            }, 500);
        }


        return res;

    });

}
