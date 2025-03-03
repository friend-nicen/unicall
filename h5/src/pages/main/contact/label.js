import {provide, ref} from 'vue'
import {store} from "@/common/usual/common";
import axios from "axios";
import api from "@/service/api";
import load from "@/common/usual/load";


export default function () {

    /* 标签弹出框 */
    const label_visible = ref(false);
    const select_customer = store({});
    const labels = ref([]);
    provide("labels", labels);
    provide("label_visible", label_visible);
    provide("select_customer", select_customer);


    /**
     * 加载所有标签
     */
    const loadLabels = () => {

        try {
            /* 开始请求 */
            axios.get(api.load_labels)
                .then((res) => {
                    /*
                    * 判断请求结果
                    * */
                    if (res.data.code) {
                        labels.value = res.data.data;
                    } else {
                        /* 弹出错误原因 */
                        load.error(res.data.errMsg);
                    }
                }).catch((e) => {
                /* 弹出错误原因 */
                load.error(e.message);
            })
        } catch (e) {
            console.log(e)
            load.error(e);
        }
    };
    loadLabels(); //加载标签

    /* 显示标签 */
    const showLabel = (item) => {
        select_customer.$set(item);
        label_visible.value = true;
    }

    return {
        showLabel,
        labels
    }

}