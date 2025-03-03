/*
* @author 友人a丶
* @date 2022-07-11
*
* 加载axio拦截器
* */
import axios from "axios";
import load from "@/common/usual/load";
import api from '@/service/api';
import quitSystem from './quit-system'
import config from "@/config";

/*
* 是否需要注册认证头
* */
if (config.auth.mode === "token") {
    // 登录的Token保存
    const xsrfHeaderName = config.auth.token; //认证头的名字
    axios.defaults.timeout = 60000;
    axios.defaults.withCredentials = true;
    axios.defaults.xsrfHeaderName = xsrfHeaderName;
    axios.defaults.xsrfCookieName = xsrfHeaderName;
}


// 不需要拦截的接口
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

/*
* 注册响应拦截器
* */
export default function () {

    console.log("加载拦截器...");

    let timer = null; //计时器

    axios.interceptors.response.use((res) => {

        console.log("请求接口：" + res.config.url)
        console.log(res);

        /*
        * 判断是否需要拦截
        * */
        if (ignoreApi.includes(res.config.url)) {
            return res;
        }


        // 如果是401(没有token/token过期) 就跳转登录界面重新登录
        if (res.data.code == -1) {

            res.data.code = 0;//转换为正常失败代码

            timer = setTimeout(() => {

                if (timer) clearTimeout(timer);//清理还未运行的定时器

                load.confirm("当前登录状态已失效，请您重新登录！", () => {
                    clearTimeout(timer); //清理运行完毕的定时器
                    quitSystem(false); //退出登录
                });

            }, 500)


        }


        return res;

    });

}
