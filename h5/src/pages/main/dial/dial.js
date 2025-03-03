/* eslint-disable */
import {inject, onActivated, provide, ref, watch} from 'vue'
import {store, switchForm} from "@/common/usual/common";
import load from "@/common/usual/load";
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
    const filter_visible = ref(false); //过滤筛选

    /* 滚动监测 */
    const {arrivedState} = useScroll(tabView,
        {
            behavior: "smooth",
            throttle: 200
        }
    )


    /* 分页信息 */
    const pagination = store({
        pageSize: 20, //每页数量
        page: 1, //当前页
        last_page: 2,
        total: 0, //总数
    })

    /* 搜索条件 */
    const condition = store({
        status: 0,
    });

    /* 依赖注入 */
    provide('condition', condition);
    provide('pagination', pagination);
    provide('loading', loading);


    /* 加载当前条件下的用户数据 */
    const loadData = () => {

        /* 显示加载效果 */
        //load.loading("加载中...");

        try {
            /* 开始请求 */
            axios.post(api.dial_list, switchForm(condition.data, {
                pageSize: pagination.data.pageSize,
                page: pagination.data.page
            })).then((res) => {
                /*
                * 判断请求结果
                * */
                if (res.data.code) {

                    /* 响应数据 */
                    loaded.value = true;
                    const body = res.data.data;

                    /* 续还是重新定义 */
                    if (pagination.data.page == 1) {
                        data.value = body.data; //数据
                    } else {
                        data.value = data.value.concat(body.data); //数据
                    }

                    /* 分页信息 */
                    pagination.data.page = body.current_page;
                    pagination.data.total = body.total;
                    pagination.data.last_page = body.last_page;

                } else {
                    /* 弹出错误原因 */
                    load.error(res.data.errMsg);
                }
            }).catch((e) => {
                /* 弹出错误原因 */
                load.error(e.message);
            }).finally(() => {
                /* 关闭加载效果 */
                load.loaded();
                /* 关闭下一页加载效果 */
                loading.value = false;
            });
        } catch (e) {
            console.log(e)
            load.error(e);
        }


    }


    /* 初始化数据 */
    watch(() => condition.data,
        debounce(() => {
            load.loading("正在加载...");
            pagination.reset(); //重置分页
            loadData();//加载数据
        }, 200),
        {
            deep: true
        });


    onActivated(() => {
        load.loading("正在加载...");
        pagination.reset(); //重置分页
        loadData();//加载数据
    })


    /*
    * 触底刷新
    * */
    watch(() => arrivedState.bottom, () => {
        if (!arrivedState.bottom) return;
        /* 最后一页了 */
        if (pagination.data.page >= pagination.data.last_page || loading.value) return;
        loading.value = true;//正在加载
        pagination.data.page++;//页号加1
        loadData(); //加载数据
    })


    return {
        loaded,
        loadData,
        data,
        condition,
        api
    }
}