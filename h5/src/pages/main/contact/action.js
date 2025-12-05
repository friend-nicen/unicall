/* eslint-disable */
import {nextTick, ref} from 'vue';
import {provides} from "@/common";

export default function () {

    /* 标签弹出框 */
    const select_action = ref({});

    /* 显示标签 */
    const showAction = (item) => {
        select_action.value = null;
        return nextTick(() => {
            select_action.value = item;
        })
    }


    /* 注入 */
    provides({
        select_action,
        showAction
    })

    return {
        showAction
    }

}