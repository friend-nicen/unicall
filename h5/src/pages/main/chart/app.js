/**
 * 打开第三方APP
 */
import {get_contents} from "@/service/requests";
import api from "@/service/api";

export default function () {


    const statusHeight = plus.navigator.getStatusbarHeight(); //状态栏高度


    /**
     * 打开企查查
     */
    const openQcc = async () => {


        /*显示加载效果*/
        plus.nativeUI.showWaiting("加载中...");


        const cookie = {value: ""}
        await get_contents(api.get_qcc_cookie, cookie, "value");


        /* 设置qcc的cookie */
        plus.navigator.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36', false); //设置为pcua
        plus.navigator.setCookie('https://qcc.com/', `QCCSESSID=${cookie.value};Max-Age=604800;Domain=.qcc.com;Path=/;`);


        /* 加载企查查功能页面 */
        const w = plus.webview.open('https://www.qcc.com', '8848', {
            popGesture: 'close',
            scalable: true,
            top: statusHeight + 'px'
        });

        w.show();//显示实名窗口

        let loaded = false; //窗口加载事件

        /*窗口加载完成，监听事件*/
        w.onloaded = function () {

            /* 防止多次加载 */
            if (loaded) {
                return;
            } else {
                loaded = true;
            }

            /* 注入js，监听回退按钮事件 */
            w.evalJS(`plus.key.addEventListener("backbutton", function () {
                            plus.nativeUI.confirm("关闭当前应用?", function(e){
                                if(e.index === 0){
                                    plus.webview.close(plus.webview.currentWebview())
                                }
                            });
                     });`);

            /*关闭加载状态*/
            plus.nativeUI.closeWaiting();

        }
    }


    return {
        openQcc
    }

}