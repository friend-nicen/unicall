import {ref} from "vue";
import user from "@/stores/user";
import load from "@/common/usual/load";
import api from "@/service/api";
import axios from "axios";

export default function () {
    /* 显示弹出 */
    const show = ref(false);
    const mobile = ref(false);
    const userInfo = user();

    /* 弹出 */
    const popup = () => {
        show.value = true;
        mobile.value = userInfo.basic.used;
    }

    /**
     * 手机号验证
     * @param phone
     * @returns {boolean}
     */
    const validPhone = (phone) => {
        const str = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
        return str.test(phone)
    }


    const set = () => {

        if (!validPhone(mobile.value)) {
            load.error("手机号格式错误！");
            return
        }

        /* 延时 */
        load.loading("加载中...");

        try {

            /* 开始请求 */
            axios.post(api.set_used, {
                phone: mobile.value
            })
                .then((res) => {
                    if (res.data.code) {
                        load.info("修改成功！");
                        userInfo.basic.used = mobile.value;
                        show.value = false;
                    } else {
                        load.error(res.data.errMsg);
                    }
                }).catch((e) => {
                load.error(e.message);
            }).finally(() => {
                load.loaded();
            });

        } catch (e) {
            console.log(e)
            load.error(e);
        }

    }


    return {
        set,
        popup,
        show,
        mobile
    }
}