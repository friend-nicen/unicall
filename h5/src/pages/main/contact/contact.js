/* eslint-disable */
import {inject, ref, watch} from 'vue'
import {provides, store, switchForm} from "@/common";
import load from "@/common/load";
import api from "@/service/api";
import axios from "axios";
import {debounce} from "lodash";
import {useScroll} from "@vueuse/core";

export default function () {

    /* 数据集 */
    const data = ref([]);
    const loaded = ref(false);
    const loading = ref(false); //加载状态
    const tabView = inject('tabView');
    const visible_filter = ref(false); //过滤筛选

    /* 滚动监测 */
    const {arrivedState} = useScroll(tabView,
        {
            behavior: "smooth",
            throttle: 200
        }
    )


    /* 分页信息 */
    const pagination = store({
        pageSize: 20,
        page: 1,
        last_page: 2,
        total: 0
    })

    /* 搜索条件 */
    const condition = store({
        status: -1,
        label: [],
        name: null,
        phone: null,
        intent: null,
        count: null,
        order: null,
        direct: null
    });

    /* 依赖注入 */
    provides({
        condition,
        loading,
        visible_filter,
        pagination
    });


    /* 加载当前条件下的用户数据 */
    const loadData = () => {

        try {
            load.loading("加载中...");
            /* 开始请求 */
            axios.post(api.custs.lists, switchForm(Object.assign(
                condition.data, {
                    pageSize: pagination.data.pageSize,
                    page: pagination.data.page
                })))
                .then((res) => {
                    /* 判断请求结果 */
                    if (res.data.code) {

                        /* 响应数据 */
                        const body = res.data.data;

                        /* 续还是重新定义 */
                        if (pagination.data.page === 1) {
                            data.value = body.data; //数据
                        } else {
                            data.value = data.value.concat(body.data);
                        }

                        /* 分页信息 */
                        pagination.data.page = body.current_page;
                        pagination.data.total = body.total;
                        pagination.data.last_page = body.last_page;

                    } else {
                        /* 弹出错误原因 */
                        load.toast(res.data.errMsg);
                    }

                    /* 结束 */
                    loaded.value = true;

                }).catch((e) => {
                /* 弹出错误原因 */
                load.toast(e.message);
            }).finally(() => {
                /* 关闭加载效果 */
                load.loaded();
                /* 关闭下一页加载效果 */
                loading.value = false;
            });
        } catch (e) {
            console.log(e)
            load.toast(e);
        }


    }


    /* 初始化数据 */
    watch(() => condition.data,
        debounce(() => {
            loading.value = true;
            pagination.reset();
            loadData();
        }, 200),
        {
            deep: true,
            immediate: true
        });


    /*
    * 触底刷新
    * */
    watch(() => arrivedState.bottom,
        () => {
            if (!arrivedState.bottom) return;
            /* 最后一页了 */
            if (pagination.data.page >= pagination.data.last_page || loading.value) return;
            loading.value = true;
            pagination.data.page++;
            loadData();
        })


    return {
        loaded,
        loadData,
        data,
        condition,
        loading,
        visible_filter
    }
}