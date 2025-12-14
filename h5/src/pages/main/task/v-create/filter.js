/*
* @author 友人a丶
* @date 
* 
* */

import {ref} from "vue";
import {provides, store, switchForm} from "@/common";
import {get_contents} from "@/service/requests";
import api from "@/service/api";
import load from "@/common/load";
import axios from "axios";
import {delay} from "lodash";

export default function (form) {

    /* 过滤筛选 */
    const visible_filter = ref(false);

    /* 搜索条件 */
    const condition = store({
        status: -1,
        labels: [],
        name: null,
        phone: null,
        intent: null,
        count: null,
        order: null,
        direct: null,
        calls: null,
        pick: null
    });


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
    const openFilter = async () => {
        if (created.value) {
            visible_filter.value = true;
        } else {
            try {
                load.loading('加载中...');
                await Promise.allSettled([
                    get_contents(api.data.intent, intent, 'value'),
                    get_contents(api.data.labels, labels, 'value'),
                    get_contents(`${api.data.status}`, status, 'value')
                ]).then(() => {
                    created.value = true;
                    visible_filter.value = true;
                }).catch(e => {
                    console.log(e);
                    load.toast('加载异常');
                })
            } finally {
                load.loaded();
            }

        }
    }


    /**
     * 筛选
     */
    const filter = () => {
        try {
            /* 显示加载效果 */
            load.loading("加载中...");
            /* 开始请求 */
            axios.get(api.task.filter, switchForm(condition.data))
                .then((res) => {
                    /* 判断请求结果 */
                    if (res.data.code) {
                        form.data.phoneText = res.data.data.join("\n");
                        delay(() => {
                            load.toast(`成功导入${res.data.data.length}条数据`)
                        }, 600);
                    } else {
                        /* 弹出错误原因 */
                        load.toast(res.data.errMsg);
                    }
                }).catch((e) => {
                /* 弹出错误原因 */
                load.toast(e.message);
            }).finally(() => {
                /* 关闭加载效果 */
                load.loaded();
            });
        } catch (e) {
            console.log(e)
            load.toast(e);
        }

    }

    provides({
        visible_filter,
        condition
    });

    return {
        openFilter,
        filter
    };
}
