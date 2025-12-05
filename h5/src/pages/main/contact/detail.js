import {ref} from 'vue';
import {provides} from "@/common";


export default function () {

    /* 标签弹出框 */
    const select_detail = ref({});
    const detailRef = ref(null);

    /* 显示标签 */
    const showDetail = (item, tab = 'profile') => {
        select_detail.value = item;
        detailRef.value.show(tab)
    }


    /* 注入 */
    provides({
        select_detail,
        showDetail
    })

    return {
        showDetail,
        detailRef
    }

}