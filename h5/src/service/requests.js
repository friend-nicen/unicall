/*
* @author 友人a丶
* @date 2022-07-11
* 基本的网络请求接口封装
* */

import load from "@/common/load";
import axios from "axios";
import api from './api';


/**
 * 用户登录验证
 * @param data Object => username 用户名 。password  用户密码
 **/
export function login(data = {}) {
    return new Promise(resolve => {
        axios.post(api.login, data)
            .then((res) => {
                resolve(res.data);
            }).catch((e) => {
            resolve({
                code: 0,
                errMsg: e.message
            })
        })
    })

}


/**
 * 简单的get请求
 * @param api
 * @param store
 * @param key
 * @returns {Promise<unknown>}
 */
export function get_contents(api, store, key = null) {

    return new Promise((resolve => {
        axios.get(api)
            .then((res) => {
                if (res.data.code) {
                    if (key === null) {
                        store = res.data.data;
                    } else {
                        store[key] = res.data.data;
                    }
                } else {
                    load.toast(res.data.errMsg)
                }

            }).catch(e => {
            load.toast(e.message)
        }).finally(resolve)

    }))

}