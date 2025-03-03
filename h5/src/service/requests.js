/*
* @author 友人a丶
* @date 2022-07-11
*
* 基本的网络请求接口封装
*
* */


import axios from "axios";
import api from './api';
import load from "@/common/usual/load";


/*
  * 用户登录验证
  * @param data Object => username 用户名 。password  用户密码
  * */
export function login(data = '') {

    return new Promise(resolve => {
        axios.post(api.login, data)
            .then((res) => {
                /*
                * 判断请求结果
                * */
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
                    load.error(res.data.errMsg)
                }

            }).catch(e => {
            load.error(e.message)
        }).finally(resolve)

    }))

}