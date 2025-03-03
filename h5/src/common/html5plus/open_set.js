/*
*打开应用的权限设置面板
* */
import load from "@/common/usual/load";

let main, pkName, Settings, Uri, Intent, loaded;

export default function () {

    /* 如果plus包没有初始化 */
    if (!loaded) {
        main = plus.android.runtimeMainActivity(); //主窗口
        pkName = main.getPackageName(); //获取应用的包名
        Settings = plus.android.importClass('android.provider.Settings'); //导入包
        Uri = plus.android.importClass('android.net.Uri');  //导入包
        Intent = plus.android.importClass('android.content.Intent'); //导入包
        loaded = true; //标记已加载
    }


    /* 实例化intent */
    let intent = new Intent(
        Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
        Uri.parse('package:' + pkName)
    )

    try {
        main.startActivity(intent) // 转跳到悬浮窗设置
    } catch (e) {
        load.error(JSON.stringify(e))
    }

}