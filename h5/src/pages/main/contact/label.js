import {nextTick, ref} from 'vue'
import {provides} from "@/common";

export default function () {

    /* 标签弹出框 */
    const select_customer = ref({});


    /* 显示标签 */
    const showLabel = (item) => {
        select_customer.value = null;
        nextTick(() => {
            select_customer.value = item;
        })
    }


    /* 注入 */
    provides({
        select_customer,
        showLabel
    });


    return {
        showLabel
    }

}