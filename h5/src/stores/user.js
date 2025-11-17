/*
* @author 友人a丶
* @date 2022-07-11
*
* 保存登录后的用户信息
* */

import {defineStore} from "pinia";
import Cookies from "js-cookie";
import config from "@/config";


export default defineStore('userInfo', {
    state() {
        /*初始数据列表*/
        return {
            id: null,
            nickname: "",
            username: "",
            used: "",
            token: "",
            monitor: null,
            expireAt: null,
            role: {
                id: null,
                name: null
            },
            permissions: [],
            depart: {
                name: null,
                id: null
            },
            cookie: {
                qcc: ""
            },
        }
    },
    actions: {
        /* 保存用户信息 */
        save(state) {

            /* 保存用户信息 */
            this.$state = state;

            /* 如果是token模式 */
            if (config.auth.mode === "token") {
                /* 保存token */
                Cookies.set(config.auth.token, state.token, {expires: state.expireAt});
            }
        }
    }
})