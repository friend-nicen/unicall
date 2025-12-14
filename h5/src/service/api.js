/*
* @author 友人a丶
* @date 2022-07-11
*
* 全局接口
* */

const BASE_URL = import.meta.env.PROD ? "" : "/api";

export default {
    host: "",//全局host
    ws: `wss://call.nicen.cn/ws`,
    avatar: `${BASE_URL}/avatar?text=`,
    event: `${BASE_URL}/event_v2`,
    /* 上报 */
    hook: `${BASE_URL}/api/hook/report`,
    /* 上报 */
    update: `${BASE_URL}/dial/v4/update`,

    /* 用户登录 */
    login: `${BASE_URL}/auth/index/login`,
    /* 通话 */
    dial: {
        create: `${BASE_URL}/dial/v6/create`,
        save: `${BASE_URL}/dial/v3/add`,
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
    detail: {
        follows: `${BASE_URL}/dial/v5/follows`,
        follow: `${BASE_URL}/dial/v5/follow`,
        calls: `${BASE_URL}/dial/v5/calls`,
        logs: `${BASE_URL}/dial/v5/logs`,
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
    },
    /* 自动任务 */
    task: {
        add: `${BASE_URL}/dial/v7/add`,
        filter: `${BASE_URL}/dial/v7/filter`,
        lists: `${BASE_URL}/dial/v7/list`,
        del: `${BASE_URL}/dial/v7/del`,
        modify: `${BASE_URL}/dial/v7/modify`
    }
}
