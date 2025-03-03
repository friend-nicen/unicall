/*
* @author 友人a丶
* @date 
* 
* */

import load from "@/common/usual/load";
import {getState} from "@/common/html5plus/monitor";
import init_copy from "@/common/usual/copy";
import readRecord from "@/common/html5plus/read-record";
import dayjs from "dayjs";
import {sleep} from "@/common/usual/common";
import axios from "axios";
import api from "@/service/api";
import {provide} from "vue";
import user from "@/stores/user";

export default function () {


    const userInfo = user();

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

    /* 复制号码 */
    const {
        text,
        copy_dom,
        copy
    } = init_copy();


    /**
     * 跳转其他应用
     * @param mobile
     */
    const openApp = (mobile) => {
        /* 复制指定的数据并跳转 */
        copy(mobile).then(() => {
            plus.runtime.openURL("wxwork://");
        })
    };

    /*
    * 获取通讯录对象
    * */
    let book = null; //通讯录对象
    const getBook = async () => {

        /* 返回 */
        if (book === false) {
            return false;
        }

        /* 返回 */
        if (book) {
            return book;
        }

        return await new Promise(resolve => {
            // 扩展API加载完毕，现在可以正常调用扩展API
            plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function (addressbook) {
                book = addressbook;
                resolve(addressbook)
            }, function () {
                book = false;
                resolve(false)
            });
        })
    }


    /*
    * 拨打电话
    * */

    let dialing = false; //正在拨号


    /**
     * 风险检测
     * @param mobile
     * @returns {Promise<unknown>|boolean}
     */
    const risk = (mobile) => {

        /* 延时 */
        load.loading("加载中...");

        try {

            /* 开始请求 */
            return axios.post(api.risk, {
                to: mobile
            })
                .then((res) => {
                    if (res.data.code) {
                        return false;
                    } else {
                        load.error(res.data.errMsg);
                        return true;
                    }
                }).catch((e) => {
                    load.error(e.message);
                    return true;
                }).finally(() => {
                    load.loaded();
                });

        } catch (e) {
            console.log(e)
            load.error(e);
            return true;
        }

    }

    const dial = async (user, appendBook = true) => {


        if (!/^\d+$/.test(user.mobile)) {
            load.toast_error("号码异常");
            return;
        }


        /* 防止多次触发 */
        if (dialing) {
            load.info("通话正在进行，请稍后...")
            return;
        } else {
            dialing = true; //标记正在拨号
        }

        /* 设置了本机号码 */
        if (userInfo.basic.used && await risk(user.mobile)) {
            dialing = false; //标记正在拨号
            return false;
        }


        /* 追加到通讯录 */
        if (appendBook) {

            const book = await getBook(); //获取通讯录

            /* 追加到通讯录 */
            if (book) {
                const contact = book.create();
                contact.name = {givenName: `${user.name}-${user.company}`};
                contact.phoneNumbers = [{type: "手机", value: user.mobile, preferred: true}];
                contact.save();
            }
        }

        /* 提交通话记录 */
        try {

            plus.device.dial(user.mobile, false);//激活拨号

            const start = dayjs(); //记录开始时间

            let count = 0; //60s内未开始自动结束

            /* eslint-disable-next-line */
            while (true) {

                /* 容错判断 */
                if (count > 25) {
                    dialing = false; //标记拨号结束
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
                /* 通话结束 */
                if (getState() === 0) {

                    let record = await readRecord({
                        callTime: start.valueOf()
                    }); //通话记录


                    /* 如果读取失败 */
                    let error = 0;

                    while (record.length === 0) {

                        await sleep(200); //休眠

                        error++; //错误加一

                        if (error > 10) {
                            dialing = false; //标记拨号结束
                            load.error("未检测到本次通话产生的记录，可能是通话并未开始！")
                            return;
                        }

                        record = await readRecord({
                            callTime: start.valueOf()
                        }); //通话记录
                    }


                    await axios.post(
                        api.add_record,
                        Object.assign(record[0], {
                            customer: user.id
                        })).then((res) => {
                        /*
                         * 判断请求结果
                         * */
                        if (res.data.code) {
                            showNotify("本次通话记录已自动上传..."); //弹出提醒
                        } else {
                            /* 弹出错误原因 */
                            load.error(res.data.errMsg);
                        }

                    }).catch((e) => {
                        /* 弹出错误原因 */
                        load.error(e.message);
                    }).finally(() => {
                        user.dial++;
                    })


                    /* 结束 */
                    dialing = false; //标记拨号结束
                    return;
                }
                await sleep(200);
            }

        } catch (e) {
            console.log(e);
            dialing = false; //标记拨号结束
            load.error(e);
        }

    };


    /* 注入方法 */
    provide('dialPhone', dial);

    /*
    * 发送短信
    * */
    const sendMessage = (mobile) => {

        if (!/^\d+$/.test(mobile)) {
            load.toast_error("号码异常");
            return;
        }

        /* 消息对象 */
        const msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);

        msg.to = [mobile];//收件人
        plus.messaging.sendMessage(msg);
    };


    return {
        copy_dom,
        openApp,
        text,
        dial,
        showNotify,
        sendMessage
    }

}