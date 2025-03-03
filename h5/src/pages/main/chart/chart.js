/*
* @author 友人a丶
* @date 
* 
* */

import {onActivated, reactive, ref, watch} from 'vue'
import dayjs from "dayjs";
import axios from "axios";
import api from "@/service/api";
import load from "@/common/usual/load";

export default function () {

    const today = dayjs().format('YYYY-MM-DD')
    const minDate = dayjs().subtract(1, 'year').toDate();


    const showCan = ref(false);
    const loaded = ref(false);

    /* 图表 */
    const chart = reactive({
        data: {
            "week": 0,
            "half": 0,
            "month": 0,
            "count": 0,
            "dial_count": 0,
            "dial_duration": 0
        }
    })

    const range = ref([today, today]);
    const selectDate = (res) => {
        range.value[0] = dayjs(res[0]).format('YYYY-MM-DD');
        range.value[1] = dayjs(res[1]).format('YYYY-MM-DD');
        showCan.value = false; //关闭日历
    }


    /* 加载当前条件下的用户数据 */
    const loadData = () => {

        /* 显示加载效果 */
        load.loading("加载中...");

        try {
            /* 开始请求 */
            axios.post(api.chart, {
                datetime: range.value
            }).then((res) => {
                /*
                * 判断请求结果
                * */

                if (res.data.code) {
                    chart.data = res.data.data;
                    loaded.value = true;
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
            });
        } catch (e) {
            console.log(e)
            load.error(e);
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
        minDate
    }

}