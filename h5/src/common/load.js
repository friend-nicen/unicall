/* 加载动画相关的方法 */
import {
    allowMultipleToast,
    closeNotify,
    showConfirmDialog,
    showDialog,
    showFailToast,
    showLoadingToast,
    showNotify,
    showSuccessToast,
    showToast
} from "vant";

/* 方法加载 */
let toast = null;
let timer = null;
let count = 0; /* 增加计数器 */
allowMultipleToast();

/* 页面加载的相关操作对象 */
export default {

    /* 显示加载 */
    loading: function (msg, force = false) {

        console.log(555, (new Error()).stack);


        /* 调用loading时计数器+1 */
        if (force) {
            count = 1
        } else {
            count++;
        }

        /* 动态更新 */
        if (!toast) {
            /* 显示加载弹窗 */
            toast = showLoadingToast({
                message: msg,
                duration: 0,
                forbidClick: true
            });
        } else {
            toast.message = msg;
        }

        return toast;
    },

    /* 关闭加载 */
    loaded: function (times = 300, force = false) {

        /* 如果是强制关闭，直接将计数器置为0 */
        if (force) {
            count = 0;
        } else {
            /* 调用loaded时计数器-1 */
            count--;
        }

        console.log(count, (new Error()).stack);

        /* 只有当计数器<=0时，才真正关闭 */
        if (count <= 0) {
            if (times) {
                /* 如果存在 */
                if (timer) {
                    clearTimeout(timer);
                }
                /* 延时关闭弹窗 */
                timer = setTimeout(() => {
                    if (toast) toast.close();
                    toast = null;
                    clearTimeout(timer);
                }, times);
            } else {
                if (toast) toast.close();
                toast = null;
            }
        }
    },

    /* 成功提示 */
    success: function (text) {
        /* 调用强制关闭 */
        this.loaded(0, true);
        return showSuccessToast(text);
    },

    /* 失败提示 */
    fail: function (text) {
        /* 调用强制关闭 */
        this.loaded(0, true);
        return showFailToast(text);
    },

    /* 轻提示 */
    toast: function (text, options) {
        /* 调用强制关闭 */
        this.loaded(0, true);
        text = typeof text === 'object' ? text.message : text;
        /* 显示轻提示 */
        return showToast(Object.assign({
            message: text,
            duration: 2000,
            zIndex: 9999
        }, options));
    },

    /**
     * 点击确认后触发回调
     * @param text 提示文本
     * @param callback 回调函数
     * @param config 配置项
     */
    info: function (text, callback = null, config = {}) {
        /* 调用强制关闭 */
        this.loaded(0, true);
        /* 显示对话框 */
        return showDialog(Object.assign({
            message: text,
            allowHtml: true
        }, config)).then(() => {
            /* 执行回调 */
            if (callback) {
                callback();
            }
        }).catch((e) => {
            console.log(e);
        });
    },

    /**
     * 点击确认后触发回调
     * @param text 提示文本
     * @param callback 回调函数
     */
    error: function (text, callback = null) {
        /* 调用强制关闭 */
        this.loaded(0, true);
        /* 显示错误对话框 */
        return showDialog({
            message: text,
            title: "提示",
            allowHtml: true,
            confirmButtonText: "确认"
        }).then(() => {
            /* 执行回调 */
            if (callback) {
                callback();
            }
        }).catch((e) => {
            console.log(e);
        });
    },

    /**
     * 点击确认后触发回调
     * @param text 提示文本
     * @param callback 回调函数
     * @param config 配置项
     */
    confirm: function (text, callback = null, config = {}) {
        /* 调用强制关闭 */
        this.loaded(0, true);
        /* 显示确认对话框 */
        return showConfirmDialog(Object.assign({
            message: text,
            allowHtml: true,
            confirmButtonText: "确认",
            cancelButtonText: "取消"
        }, config)).then(() => {
            /* 执行回调 */
            if (callback) {
                callback();
            }
        }).catch((e) => {
            console.log(e);
        });
    },

    /* 通知*/
    notify(obj) {
        // 3 秒后自动关闭
        showNotify(obj);
    },

    /* 关闭通知 */
    closeNotify() {
        closeNotify();
    },
};