import {onMounted, ref} from "vue";
import {provides} from "@/common";
import {get_contents} from "@/service/requests";
import api from "@/service/api";

export default function () {

    /* 数据 */
    const labels = ref([]);
    const status = ref([]);
    const intent = ref([]);
    const created = ref(false);

    provides({
        labels,
        status,
        intent
    });

    /* 加载标签 */
    onMounted(() => {
        return Promise.allSettled([
            get_contents(api.data.intent, intent, 'value'),
            get_contents(api.data.labels, labels, 'value'),
            get_contents(`${api.data.status}?return=array`, status, 'value')
        ]).finally(() => {
            created.value = true;
        })
    });

    return {
        labels,
        status,
        intent,
        created
    }
}