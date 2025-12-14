/* eslint-disable */
import {onMounted, provide, ref} from 'vue';
import api from '@/service/api';
import request from '@/common/request';
import {showConfirmDialog} from "vant";
import load from "@/common/load";
import axios from "axios";

export default function () {

    const refreshing = ref(false)

    const {
        data,
        loading: loading,
        loaded,
        finish,
        paginate,
        loadData
    } = request({
        url: api.task.lists,
        showLoading: () => {
            return loaded.value;
        },
        complete() {
            refreshing.value = false;
        }
    })

    const refresh = () => {
        paginate.reset();
        loadData();
    }

    onMounted(() => refresh())
    provide('refresh', refresh)

    /**
     * 删除
     * @param it
     */
    const removeTask = (it) => {
        load.confirm('确认删除该任务？', () => {
            /* 显示加载效果 */
            load.loading("加载中...");
            try {
                /* 开始请求 */
                axios.post(api.task.del, {
                    id: it
                }).then((res) => {
                    /* 判断请求结果 */
                    if (res.data.code) {
                        refresh();
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
        })
    }


    return {
        loaded,
        loadData,
        data,
        loading,
        refreshing,
        refresh,
        finish,
        removeTask
    }
}
