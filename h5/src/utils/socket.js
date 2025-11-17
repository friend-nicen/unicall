import {store} from "@/store";
import {computed} from "vue"
import load from "@/common/usual/load";
import dayjs from "dayjs";
import {getState, start, moveTop, getRecordPath, readDirs} from "@/common/monitor"
import {sub} from "@/common/welcome";
import getContact from "@/common/getContact";
import {clearAuth} from "@/utils/Auth";
import openDir from '@/common/openDir'


/*
* 全局标志位
* */

// 标记是否需要监听通话状态，当websocket 收到拨号请求时变成1，代表开始监听通话状态;
// 当通话状态从通话中变成未通话时，读取录音文件进行上传，标志位贵归0，等待下次的websocket请求


//将作为传递给start函数的参数，用于比对文件修改时间

let call_state = 0; //用于手动标记的通话状态
let startTime = 0; //通话开始时间

//通话状态
//业务逻辑

/*
*  crm端发送拨号请求，websocket接受到请求，准备拨号，同时is_calling标志位变成1，代表开始监听通话状态；
*  然后启动拨号，通话状态call_state变成通话中，记录通话开始的时间，持续监控；
*  通话状态call_state由通话中变成未通话代表一次通话完成
*  系统开始上传通话生成的录音文件（是否需要延时几秒等待录音文件生成）
*  上传过程：
*      1. 根据手机型号找到对应的录音文件存储目录
*      2. 从目录内检索所有文件，排序之后找到最新的文件
*      3. 将文件的最后修改时间和通话开始时间进行比对，本次通话的录音文件必定是在通话之后生成的
*      4. 由于uniapp的限制，plus的IO接口只能操作应用沙箱内的目录文件，所以需要通过native,js的去调用java
*      5. 通过java的FileCHannel类将文件复制到应用沙箱目录
*      6. 通过plus的upload上传文件
*      7. 文件上传成功，业务流程结束。
* 状态位重置：is_calling变成0，代表不需要记录通话状态。
*
* */


/*
* 通话状态
* state,0未通话，1，呼入，2通话中
* */


/*初始化websocket*/
/*接受websocket的手机号*/
export default function () {


    /*
    * websocket全局对象，系统是否初始化
    * */
    let websokect, loaded;

    /*websocket接口*/
    const ws = computed(() => {
        return store.state.user.websocket;
    });

    let current = store.state.user.mobile;//当前登录的用户的手机号
    let error = false; //只报错一次，错误清除时恢复为true

    load.loading("正在认证..");

    /*用于进行websocket登录的数据*/
    const msg = {
        type: "mobile_login",
        msg: {
            name: current,
            speak: current
        }
    };

    /*websocket心跳检测*/
    const heartbeat = () => {

        /*
        * 判断websocket链接状态
        * readyState 0尚未建立连接 1连接已经建立 2连接正在关闭 3连接已经关闭或不可用
        * */
        if (websokect.readyState != 2 && websokect.readyState != 1) {

            /*
            * 关闭异常的websocekt
            * */
            //store.commit("pushMessage", `系统重连，当前错误码：${websokect.readyState}！`); //新增一条消息

            websokect.close()
            websokect = null;


            load.loading("正在重连..")
            register(); //重新连接websocket

        } else {
            /*发送登录心跳包*/
            websokect.send(JSON.stringify(msg)); //请求登录
            /*同步消息界面的时间显示*/
            store.commit("setDatetime", dayjs().format("YYYY-MM-DD HH:mm:ss"));

            /*
            * 通话开始
            * */
            if (getState() == 2 && call_state == 0) {
                startTime = dayjs().valueOf(); //记录微秒的时间戳
                call_state = 2; //记录通话开始
            }


            /*
            * 通话结束
            * */
            if (getState() == 0 && call_state == 2) {

                call_state = 0; //记录通话结束

                load.loading("正在提交..");

                /*
                * 等待500ms
                * */
                let counter = setTimeout(() => {

                    /*
                    * 传递通话开始时间
                    * 和当前登录的号码
                    *
                    * 开始上传记录
                    * */

                    start({
                        start: startTime,
                        from_phone: current
                    }).then((res) => {

                        load.loaded(0);

                        /*
                        * 判断上传的结果
                        * */
                        if (!res.code) {
                            /*增加一条记录*/
                            store.commit("pushMessage", `${res.errMsg}！`); //新增一条消息
                        } else {
                            /*增加一条记录*/
                            store.commit("pushMessage", `和${sub(res.from_phone)}通话${res.duration}秒！`); //新增一条消息
                        }

                        clearTimeout(counter); //清除定时器

                        /*
                        * 文件数量判断
                        * */
                        if (res.audioNumber >= 20) {
                            load.confirm("您的本地通话录音文件数量过多，共【" + res.audioNumber + "个】，为避免软件卡顿，建议您进行清理");
                        }


                    }).catch((e) => {
                        load.toast(JSON.stringify(e));
                    }).finally(() => {
                        load.loaded(0);
                    });

                }, 500)

            }


        }


    }


    /*
    * 重新拼接通知
    * */
    let str = computed(() => {
        return '<div class="horizontal" style="margin-bottom: 15px;">今日通时通次报表</div>' + store.state.user.str;
    })


    /*websocket事件注册*/
    let register = () => {

        /*初始化ws*/
        websokect = new WebSocket(ws.value);
        store.commit("setWsSocket", websokect);


        /*链接成功时发送*/
        websokect.onopen = async function () {

            error = false;//重置错误标记

            load.loading("认证成功..")

            /*发送登录事件*/
            this.send(JSON.stringify(msg)); //请求登录
            load.loaded(0); //关闭加载效果


            /*
            * 是否要初始化
            * */
            if (!loaded) {
                /*
                   * 读取通讯录联系人数量
                   * */
                const contacts = await getContact();

                /*增加一条记录*/
                store.commit("pushMessage", `${store.state.user.mobile}<br />${str.value}<br/>通讯录联系人数量：${contacts}`); //新增一条消息
                /*增加一条记录*/
                store.commit("pushMessage", "连接成功!");//新增一条消息

                loaded = true; //标记已初始化
            }


            /*心跳检测*/
            let timer = setInterval(() => {
                heartbeat();
            }, 500)

            /*记录定时器*/
            store.commit('setTimer', timer);

        }

        /*收到消息时触发*/
        websokect.onmessage = function (e) {

            moveTop(); //后台应用弹出

            /*
            * 登录同一个账号，退出登录
            * */
            if (e.data == "quit") {
                clearAuth(false);
                return;
            }

            /*
            * 拨号
            * */
            if (e.data.indexOf("#") == -1) {
                plus.device.dial(e.data, false);//激活拨号
            } else {

                /*
                * 发短信
                * */
                const phone = e.data.replace("#", ""); //解析短信内容
                const msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);

                msg.to = [phone];
                msg.body = store.state.user.template;
                plus.messaging.sendMessage(msg);
            }


        }

        /*异常时触发*/
        websokect.onerror = function (e) {

            /*判断是否已经报错了*/
            if (error) {
                return;
            }

            /*增加一条记录*/
            store.commit("pushMessage", "连接中断，正在重新连接..!" + JSON.stringify(e)); //新增一条消息

            error = true
        }

    }


    /*初始化websocket*/
    register();


}