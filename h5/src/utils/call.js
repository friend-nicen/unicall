/* 正在拨号 */
import {getState, handle} from "@/plus/monitor";
import load from "@/common/load";
import dayjs from "dayjs";
import {sleep} from "@/common";
import read from "@/plus/read";
import axios from "axios";
import api from "@/service/api";

let dialing = false;

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

/**
 * 拨号
 * @param cust
 * @param option
 * @return {Promise<void>}
 */
export default async function call(cust, option = {}) {

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
            if (count > 10) {
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

                    if (error > 5) {
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
                    api.dial.save,
                    Object.assign(record[0], {
                        phone: cust.phone,
                        start_time: start.format('YYYY-MM-DD HH:mm:ss')
                    }, option))
                    .then((res) => {

                        /* 记录 */
                        cust.last_call = start.format('YYYY-MM-DD HH:mm:ss');
                        if ('calls' in cust) cust.calls++;

                        /* 判断请求结果 */
                        if (res.data.code) {
                            /* 处理文件 */
                            if (record[0].duration > 0) {
                                handle(start.unix(), {
                                    id: res.data.data
                                })
                                    .then(res => {
                                        if (!res.code) {
                                            load.toast(res.msg);
                                        }
                                    }).catch(e => {
                                    console.stack(e);
                                    load.toast(e);
                                }).finally(() => {
                                    load.loaded();
                                })
                            } else {
                                load.loaded();
                            }
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

}
