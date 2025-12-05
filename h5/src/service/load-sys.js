/* eslint-disable */

/*
* @author 友人a丶
* @date 2022-07-11
* 初始化用户信息
* */

import load from "@/common/load";
import {login} from "@/service/requests";
import _user from "@/stores/user";
import sys from "@/stores/sys";

/*
* 初始化用户信息
* @已登录，返回登录信息
* @未登录，返回空信息
* */
export default async function load_user() {

    load.loading("加载数据....");
    console.log("加载用户信息...");

    /* 请求初始化登录 */
    const result = await login();
    const user = _user();

    /* 结束 */
    load.loaded(200);

    /* 标记系统初始化完毕 */
    sys.sys_ready = true;

    /* 保存用户信息 */
    if (result.code) {
        user.save(result.data.user);
        sys.fields = result.data.sys.fields;
        return true;
    }

    return false;

}
