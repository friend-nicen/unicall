/*
* @author 友人a丶
* @date
* */

import {onActivated, ref, watch} from 'vue'
import dayjs from "dayjs";
import axios from "axios";
import api from "@/service/api";
import load from "@/common/load";

export default function () {

    const today = dayjs().format('YYYY-MM-DD')
    const minDate = dayjs().subtract(1, 'year').toDate();
    const maxDate = dayjs().toDate();


    const showCan = ref(false);
    const loaded = ref(false);

    /* 图表 */
    const chart = ref({
        'total': null,
        'answer': null,
        'missed': null,
        'duration': null,
        'call': null,
        'cust': null,
        'day_call': null,
        'day_cust': null
    });

    /* 日期范围 */
    const range = ref(today);

    /* 日起选择 */
    const selectDate = (res) => {
        range.value = dayjs(res).format('YYYY-MM-DD');
    }


    /* 加载当前条件下的用户数据 */
    const loadData = () => {

        /* 显示加载效果 */
        load.loading("加载中...");

        try {
            /* 开始请求 */
            axios.post(api.chart.day, {
                day: range.value
            })
                .then((res) => {
                    /* 判断请求结果 */
                    if (res.data.code) {
                        chart.value = res.data.data;
                        loaded.value = true;
                        showCan.value = false;
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


    watch(() => range, loadData, {
        deep: true
    })

    onActivated(loadData);

    return {
        showCan,
        selectDate,
        range,
        loaded,
        chart,
        minDate,
        maxDate
    }

}