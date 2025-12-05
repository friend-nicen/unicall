import load from "@/common/load";
import {login as toLogin} from "@/service/requests";
import {router} from "@/router";
import config from "@/config";
import {useLocalStorage} from "@vueuse/core";
import _user from "@/stores/user";

/**
 * 封装登录相关的方法
 **/
export default function () {

    const mobile = useLocalStorage("mobile", null);//账号
    const password = useLocalStorage("password", null)//密码
    const user = _user();//用户信息

    /* 验证登录是否仍然有效 */
    const login = async function () {

        /* 去除空格 */
        mobile.value = mobile.value.trim()
        password.value = password.value.trim()


        /* 验证表单 */
        if (mobile.value.length === 0) {

            load.toast("手机号不能为空");
            return;
        }

        if (password.value.length === 0) {
            load.toast("密码不能为空")
            return
        }

        load.loading("登录中...");

        const res = await toLogin({
            username: mobile.value,
            password: password.value
        });


        /* 判断登录结果 */
        if (res.code) {

            /* 保存用户状态 */
            user.save(res.data.user);
            /* 跳转首页 */
            router.replace(config.index);
        } else {
            load.toast(res.errMsg)
        }

        load.loaded();

    }

    return {
        mobile,
        password,
        login
    }

}




