/* eslint-disable */
import {nextTick, ref} from 'vue';
import {provides} from "@/common";

export default function () {

    /* 标签弹出框 */
    const select_edit = ref({});

    /* 显示标签 */
    const showEdit = (item) => {
        select_edit.value = null;
        nextTick(() => {
            select_edit.value = item;
        })
    }


    /* 注入 */
    provides({
        select_edit,
        showEdit
    })

    return {
        showEdit
    }

}