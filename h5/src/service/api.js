/*
* @author 友人a丶
* @date 2022-07-11
*
* 全局接口
* */

const BASE_URL = import.meta.env.PROD ? "" : "/api";

export default {
    host: BASE_URL,//全局host
    avatar: `${BASE_URL}/avatar?text=`,
    /* 用户登录 */
    login: `${BASE_URL}/auth/index/login`,
    ws: `wss://call.nicen.cn/ws`,
    /* 通话 */
    dial: {
        add: `${BASE_URL}/dial/v2/add`,
        upload: `https://call.nicen.cn/dial/v3/upload`,
    },
    /* 加载客户列表 */
    custs: {
        /* 列表 */
        lists: `${BASE_URL}/dial/v3/lists`,
        /* 通话记录 */
        calls: `${BASE_URL}/dial/v3/calls`,
        /* 加载标签 */
        detail: `${BASE_URL}/dial/v2/detail`,
        /* 修改 */
        modify: `${BASE_URL}/dial/v2/modify`
    },
    /* 标签 */
    label: {
        /* 列表 */
        lists: `${BASE_URL}/dial/v2/label`,
        /* 加载标签 */
        modify: `${BASE_URL}/dial/v2/alter`,
    },
    /* 数据 */
    data: {
        /* 标签列表 */
        labels: `${BASE_URL}/dial/v1/label`,
        /* 客户状态 */
        status: `${BASE_URL}/dial/v1/status`,
        /* 客户意向 */
        intent: `${BASE_URL}/dial/v1/intent`,
    },
    /* 数据报表 */
    chart: {
        /* 列表 */
        day: `${BASE_URL}/dial/v4/day`,
    }
}