/* eslint-disable */
import {nextTick, ref} from 'vue';
import {provides} from "@/common";

export default function () {

    /* 标签弹出框 */
    const select_follow = ref({});
    const after_follow = {callback: ""};

    /* 显示标签 */
    const showFollow = (item) => {
        select_follow.value = null;
        nextTick(() => {
            select_follow.value = item;
        })
    }


    /* 注入 */
    provides({
        select_follow,
        showFollow,
        after_follow
    })

    return {
        showFollow
    }

}