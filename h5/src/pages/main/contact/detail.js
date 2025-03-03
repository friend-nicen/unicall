import {provide, ref} from 'vue'
import {store} from "@/common/usual/common";


export default function () {

    /* 标签弹出框 */
    const detail_visible = ref(false);
    const select_detail_customer = store({});
    provide("detail_visible", detail_visible);
    provide("select_detail_customer", select_detail_customer);


    /* 显示标签 */
    const showDetail = (item) => {
        select_detail_customer.$set(item);
        detail_visible.value = true;
    }

    return {
        showDetail
    }

}