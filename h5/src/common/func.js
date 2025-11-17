/*
* @author 友人a丶
* @date 
* 函数
* */

import user from "@/stores/user";


/**
 * 判断用户是否具有权限
 * @param  permiss {array}
 * @param or {boolean}
 * @return {boolean}
 */
export function auth(permiss, or = false) {

    /* 类型转换 */
    if (!Array.isArray(permiss)) {
        permiss = [permiss];
    }

    /* 获取用户信息 */
    const userInfo = user();

    /* 用户没有权限 */
    if (!userInfo.permissions && userInfo.permissions.length === 0) {
        return false;
    }

    /**
     * 与还是或
     * */
    if (or) {

        for (let i = 0; i < permiss.length; i++) {
            if (userInfo.permissions.indexOf(permiss[i]) > -1) {
                return true;
            }
        }

        return false;

    } else {

        for (let i = 0; i < permiss.length; i++) {
            if (userInfo.permissions.indexOf(permiss[i]) === -1) {
                return false;
            }
        }

        return true;
    }

}
