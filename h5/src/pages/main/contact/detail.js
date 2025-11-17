import {nextTick, ref} from 'vue';
import {provides} from "@/common";


export default function () {

    /* 标签弹出框 */
    const select_detail = ref({});

    /* 显示标签 */
    const showDetail = (item) => {
        select_detail.value = null;
        nextTick(() => {
            select_detail.value = item;
        })
    }


    /* 注入 */
    provides({
        select_detail,
        showDetail
    })

    return {
        showDetail
    }

}