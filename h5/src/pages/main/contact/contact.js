/* eslint-disable */
import {computed, reactive, ref, watch} from 'vue'
import {provides, store, switchForm} from "@/common";
import {delay} from "lodash";
import load from "@/common/load";
import api from "@/service/api";
import axios from "axios";
import call from "@/utils/call";


export default function () {

    /* 数据集 */
    const data = ref([]);

    const loaded = ref(false);
    const loading = ref(false);

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

    /* 筛选条件 */
    const equals = computed(() => {
        return Object.keys(condition.data).filter(i => {
            return i !== 'status' && !!condition.data[i];
        }).length;
    })

    /* 统计 */
    const summary = reactive({
        data: null
    });

    /* 依赖注入 */
    provides({
        condition,
        visible_filter,
        pagination,
        equals,
        summary
    });

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
            axios.post(api.custs.lists, switchForm(Object.assign({},
                condition.data, {
                    pageSize: pagination.data.pageSize,
                    page: pagination.data.page
                })))
                .then((res) => {
                    /* 判断请求结果 */
                    if (res.data.code) {

                        /* 响应数据 */
                        const body = res.data.data;
                        summary.data = res.data.data.summary;


                        /* 分页信息 */
                        pagination.data.total = body.total;
                        pagination.data.last_page = body.last_page;

                        /* 续还是重新定义 */
                        if (pagination.data.page === 1) {
                            data.value = body.data; //数据
                        } else {
                            data.value = data.value.concat(body.data);
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
        deep: true, immediate: true
    });


    return {
        loaded,
        loadData,
        data,
        condition,
        loading,
        refreshing,
        refresh,
        finish,
        visible_filter,
        call
    }
}