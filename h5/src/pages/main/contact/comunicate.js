/* eslint-disable */
/*
* @author 友人a丶
* @date 
* 
* */

import load from "@/common/load";
import {getState, handle} from "@/plus/monitor";
import read from "@/plus/read";
import dayjs from "dayjs";
import {sleep} from "@/common";
import axios from "axios";
import api from "@/service/api";
import {provide} from "vue";

export default function () {

    /* 显示弹出 */
    const showNotify = (text) => {
        load.notify({
            type: 'primary',
            message: text,
            background: '#fa541c',
            position: 'bottom',
            duration: 3000
        })
    }

    /* 正在拨号 */
    let dialing = false;

    /**
     * 拨号
     * @param cust
     * @return {Promise<void>}
     */
    const call = async (cust) => {

        if (!/^\d+$/.test(cust.phone)) {
            load.toast("号码异常");
            return;
        }

        /* 防止多次触发 */
        if (dialing) {
            load.toast("通话正在进行，请稍后...")
            return;
        } else {
            dialing = true;
        }


        /* 提交通话记录 */
        try {

            /* 触发拨号 */
            plus.device.dial(cust.phone, false);

            /* 记录开始时间 */
            const start = dayjs();

            /* 60s内未开始自动结束 */
            let count = 0;

            /* eslint-disable-next-line */
            while (true) {

                /* 容错判断 */
                if (count > 25) {
                    dialing = false;
                    return;
                }

                /* 通话结束 */
                if (getState() !== 0) {
                    break;
                } else {
                    count++;
                }

                await sleep(200);
            }

            /* eslint-disable-next-line */
            while (true) {

                /* 判断通话状态 */
                if (getState() === 0) {

                    /* 如果读取失败 */
                    let error = 0, record = [];

                    /* eslint-disable-next-line */
                    while (true) {

                        /* 读取通话记录 */
                        record = read.record({
                            callTime: start.valueOf()
                        });

                        /* 存在记录 */
                        if (record.length !== 0) {
                            break;
                        }

                        /* 等待 */
                        await sleep(200);

                        /* 错误加一 */
                        error++;

                        if (error > 10) {
                            dialing = false;
                            showNotify("未检测到本次通话产生的记录")
                            return;
                        }

                    }

                    /* 处理 */
                    load.loading('上传中...');

                    /* 判断网络状态 */
                    /* eslint-disable-next-line */
                    while (true) {
                        if (plus.networkinfo.getCurrentType() !== plus.networkinfo.CONNECTION_NONE) {
                            break;
                        } else {
                            await sleep(200)
                        }
                    }

                    /* 上传通话记录 */
                    await axios.post(
                        api.dial.add,
                        Object.assign(record[0], {
                            id: cust.id,
                            start_time: start.format('YYYY-MM-DD HH:mm:ss')
                        }))
                        .then((res) => {
                            /* 记录 */
                            cust.last_call = start.format('YYYY-MM-DD HH:mm:ss');
                            /* 判断请求结果 */
                            if (res.data.code) {
                                /* 弹出提示 */
                                showNotify("本次通话记录已自动上传...");
                                /* 处理文件 */
                                handle(start.unix(), {
                                    id: res.data.data
                                })
                                    .then(res => {
                                        if (!res.code) {
                                            load.toast(res.msg);
                                        } else {
                                            showNotify("本次通话录音已自动上传...");
                                        }
                                    }).catch(e => {
                                    load.toast(e.message);
                                }).finally(() => {
                                    load.loaded();
                                })
                            } else {
                                load.toast(res.data.errMsg);
                            }
                        }).catch((e) => {
                            /* 弹出错误原因 */
                            load.toast(e.message);
                        }).finally(() => {
                            cust.dial++;
                        })


                    /* 结束 */
                    dialing = false;
                    return;
                }

                /* 持续等待 */
                await sleep(200);
            }

        } catch (e) {
            console.log(e);
            dialing = false;
            load.toast(e);
        }

    };


    /* 注入方法 */
    provide('call', call);

    /* 发送短信 */
    const sendMessage = (mobile) => {

        if (!/^\d+$/.test(mobile)) {
            load.toast("号码异常");
            return;
        }

        /* 消息对象 */
        const msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);

        msg.to = [mobile];
        plus.messaging.sendMessage(msg);
    };

    return {
        sendMessage,
        call,
        showNotify
    }

}