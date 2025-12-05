import sys from "@/stores/sys";
import event from "@/stores/event";
import load from "@/common/load";
import profill from "@/utils/profill";


/**
 * 初始化系统事件
 */
export function init_sys() {

    /* 调试模式 */
    if (sys.debug) {
        sys.app_ready = true;
        return;
    }

    /* 添加默认事件 */
    event.add('backbutton', () => {
        load.confirm('确认要退出应用嘛？', () => {
            plus.runtime.quit()
        });
    });

    /* 全局监听点击回退按钮事件 */
    plus.key.addEventListener("backbutton", function () {
        if (event.get('backbutton')) {
            event.get('backbutton')();
        }
    });

    /* 应用初始化完毕 */
    sys.app_ready = true;
}


/**
 * 初始化plus
 * @return {*}
 */
export function init_plus() {

    load.loading("加载数据...");

    return new Promise(resolve => {

        /* 初始化plus */
        const initialize = function () {
            sys.plus_ready = true;
            load.loaded(200);
            plus.navigator.closeSplashscreen();
            resolve();
        }

        /* 如果plus未初始化，择监听plusready事件 */
        if (typeof plus == "undefined") {
            /* 调试模式 */
            if (sys.debug) {
                profill();
                initialize();
            }
            document.addEventListener("plusready", initialize);
        } else {
            initialize();
        }
    });
}



