/*
* @author 友人a丶
* @date 
* 
* */

import {injects, store} from "@/common";
import {ref} from "vue";
import load from "@/common/load";
import axios from "axios";
import api from "@/service/api";

export default function () {

    const {
        visible,
        refresh
    } = injects([
        'visible',
        'refresh'
    ]);

    /* 添加任务的表单 */
    const form = store({
        id: null,
        name: '',
        phoneText: '',
        seconds: 3,
        autoAdd: false,
        addAfterConnect: true
    })

    const formRef = ref(null);
    const task = {data: null};


    /* 解析手机号 */
    const parsePhones = (text) => {
        return (text || '')
            .split(/\r?\n|\s+/)
            .map((s) => s.replace(/[^\d]/g, ''))
            .filter((s) => s)
    }

    /* 去重 */
    const unique = (arr) => Array.from(new Set(arr));


    const validateSeconds = (val) => {
        const n = Number(val)
        return Number.isInteger(n) && n >= 1 && n <= 60
    }

    const validatePhones = () => {
        return parsePhones(form.data.phoneText).length > 0
    }


    /* 添加 */
    const add = () => {
        try {
            /* 显示加载效果 */
            load.loading("加载中...");
            const phones = unique(parsePhones(form.data.phoneText));
            /* 开始请求 */
            axios.post(api.task.add, {
                name: form.data.name,
                phone: phones.join('\n'),
                auto: form.data.autoAdd ? 1 : 0,
                answer: form.data.addAfterConnect ? 1 : 0,
                interval: form.data.seconds,
                total: phones.length
            }).then((res) => {
                /* 判断请求结果 */
                if (res.data.code) {
                    visible.create = false;
                    refresh();/* 刷新 */
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

    /* 修改 */
    const modify = async () => {
        try {
            /* 显示加载效果 */
            load.loading("加载中...");
            /* 开始请求 */
            axios.post(api.task.modify, {
                id: form.data.id,
                name: form.data.name,
                auto: form.data.autoAdd ? 1 : 0,
                answer: form.data.addAfterConnect ? 1 : 0,
                interval: form.data.seconds
            }).then((res) => {
                /* 判断请求结果 */
                if (res.data.code) {
                    visible.create = false;
                    Object.assign(task.data, {
                        name: form.data.name,
                        auto: form.data.autoAdd ? 1 : 0,
                        answer: form.data.addAfterConnect ? 1 : 0,
                        interval: form.data.seconds
                    });
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
    };

    /* 提交 */
    const submit = () => {
        formRef.value?.validate()
            .then(() => {
                if (task.data) modify();
                else add();
            }).catch((errors) => {
            load.toast(errors?.[0]?.message || '请完善表单')
        })
    }


    return {
        form,
        visible,
        submit,
        parsePhones,
        formRef,
        validatePhones,
        validateSeconds,
        task
    }

}
