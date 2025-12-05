/* eslint-disable */
import {computed, provide, ref, watch} from 'vue'
import {store, switchForm} from "@/common";
import load from "@/common/load";
import api from "@/service/api";
import axios from "axios";
import {delay} from "lodash";

export default function () {

    /* 数据集 */
    const data = ref([]);
    const loaded = ref(false);
    const loading = ref(false); //加载状态

    /* 分页信息 */
    const pagination = store({
        pageSize: 20,
        page: 0,
        last_page: 1,
        total: 0
    })


    /* 结束了没 */
    const finish = computed(() => {
        return pagination.data.page === pagination.data.last_page;
    });


    /* 搜索条件 */
    const condition = store({
        status: -1,
    });

    /* 依赖注入 */
    provide('condition', condition);
    provide('pagination', pagination);


    /* 加载当前条件下的用户数据 */
    const loadData = () => {
        try {

            if (finish.value) return;
            if (loaded.value) load.loading("加载中...");

            /* 加载中 */
            loading.value = true;

            /* 页数加1 */
            pagination.data.page++;

            /* 开始请求 */
            axios.post(api.custs.calls, switchForm(Object.assign({}, condition.data, {
                pageSize: pagination.data.pageSize,
                page: pagination.data.page
            }))).then((res) => {
                /* 判断请求结果 */
                if (res.data.code) {

                    /* 响应数据 */
                    const body = res.data.data;

                    /* 分页信息 */
                    pagination.data.total = body.total;
                    pagination.data.last_page = body.last_page;

                    /* 续还是重新定义 */
                    /* 为每条记录初始化 playing 状态 */
                    if (pagination.data.page === 1) {
                        /* 首次加载，重置数据并附加 playing 字段 */
                        data.value = (body.data || []).map(i => {
                            i.name = !i.name ? "无" : i.name;
                            return ({...i, playing: false})
                        });
                    } else {
                        /* 追加分页数据，附加 playing 字段 */
                        const append = (body.data || []).map(i => {
                            i.name = !i.name ? "无" : i.name;
                            return ({...i, playing: false})
                        });
                        data.value = data.value.concat(append);
                    }
                } else {
                    /* 弹出错误原因 */
                    load.toast(res.data.errMsg);
                }
                /* 结束 */
                if (!loaded.value) loaded.value = true;

            }).catch((e) => {
                /* 弹出错误原因 */
                load.toast(e.message);
            }).finally(() => {
                /* 关闭加载效果 */
                load.loaded(200, true);
                /* 关闭下一页加载效果 */
                loading.value = false;
                refreshing.value = false;
            });
        } catch (e) {
            console.log(e)
            load.toast(e);
        }

    }


    /* 加载 */
    const refreshing = ref(false);

    /* 刷新 */
    const refresh = () => {
        pagination.reset();
        loadData();
    };

    /* 初始化数据 */
    watch(() => condition.data, refresh, {
        deep: true,
        immediate: true
    });


    return {
        loaded,
        loadData,
        data,
        condition,
        loading,
        refreshing,
        refresh,
        finish
    }
}
