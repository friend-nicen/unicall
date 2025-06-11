/*
* @author 友人a丶
* @date 
* 
* */

import load from "@/common/usual/load";
import {getState, handle} from "@/common/html5plus/monitor";
import readRecord from "@/common/html5plus/read-record";
import dayjs from "dayjs";
import {sleep} from "@/common/usual/common";
import axios from "axios";
import api from "@/service/api";

export default function (loadData) {

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

    const dial = async (user) => {


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


        const book = await getBook(); //获取通讯录


        /* 追加到通讯录 */
        if (book) {
            const contact = book.create();
            contact.name = {givenName: `${user.name}-${user.company}`};
            contact.phoneNumbers = [{type: "手机", value: user.mobile, preferred: true}];
            contact.save();
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

                            /* 开始上次本次通话产生的录音文件 */
                            handle(start, res.data.data)

                            loadData(); //刷新数据

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


    return {
        dial,
        showNotify
    }

}