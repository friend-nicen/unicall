/*加载动画相关的方法*/
import {showLoadingToast, showSuccessToast, showFailToast, closeToast} from "vant";
import {showDialog, showConfirmDialog} from 'vant';
import {showNotify, closeNotify} from 'vant';


/*
* @友人a丶
* 通用方法
* 封装的一些加载效果
* */

let toast, timer;

/*页面加载的相关操作对象*/
export default {

    /**
     * 加载提示
     * @param msg
     */
    loading: function (msg) {

        /*动态更新*/
        if (!toast) {
            /*显示加载弹窗*/
            toast = showLoadingToast({
                message: msg,
                duration: 0,
                forbidClick: true,
            });
        } else {
            toast.message = msg;
        }

    },

    /**
     * 关闭加载提示
     * @param time
     */
    loaded: function (time = 200) {

        if (timer) clearTimeout(timer);

        /*延时1s关闭弹窗*/
        timer = setTimeout(() => {
            closeToast();
            clearTimeout(timer);
            toast = null;
        }, time)

    },

    /**
     * 成功提示
     */
    success(text) {
        showSuccessToast(text);
    },

    /*
    * 失败的提示
    * */
    toast_error(text) {
        showFailToast(text);
    },

    /*
    * 通知
    * */
    notify(obj) {
        // 3 秒后自动关闭
        showNotify(obj);
    },

    /*
    * 关闭通知
    * */
    closeNotify() {
        closeNotify();
    },

    /**
     * 消息提醒
     * @param text
     * @param callback
     * @param config
     */
    info(text, callback = null, config = {}) {
        closeToast();
        showDialog(Object.assign({
            message: text,
            title: "消息提示",
            allowHtml: true
        }, config)).then(() => {
            if (!callback) {
                return;
            } else {
                callback();
            }

        }).catch(() => {
            return
        });
    },
    /**
     * 消息提醒
     * @param text
     * @param callback
     * @param config
     */
    error(text, callback = null, config = {}) {
        closeToast();
        showDialog(Object.assign({
            message: text,
            title: "消息提示",
            allowHtml: true
        }, config)).then(() => {
            if (!callback) {
                return;
            } else {
                callback();
            }

        }).catch(() => {
            return
        });
    },

    /**
     * 消息确认
     * @param text
     * @param callback
     */
    confirm(text, callback = null, config = {}) {
        closeToast();
        showConfirmDialog(Object.assign({
            message: text,
            title: "消息提示",
            allowHtml: true
        }, config)).then(() => {
            if (!callback) {
                return;
            } else {
                callback();
            }
        }).catch(() => {
            return
        });
    },

}
