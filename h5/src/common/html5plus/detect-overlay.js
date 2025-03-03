import load from "@/common/usual/load";


/* 变量声明 */

let main; //主activity
let pkName; //包名
let Settings; //设置
let Uri; //uri
let Intent; //意图
let inited; //初始化了没
let action; //动作


/**
 * 是否跳转设置页面
 * @param flag
 */
export default function (flag = true) {

    /* 如果没有初始化 */
    if (!inited) {
        main = plus.android.runtimeMainActivity();
        pkName = main.getPackageName();
        Settings = plus.android.importClass('android.provider.Settings');
        Uri = plus.android.importClass('android.net.Uri');
        Intent = plus.android.importClass('android.content.Intent');
        action = new Intent(
            'android.settings.action.MANAGE_OVERLAY_PERMISSION',
            Uri.parse('package:' + pkName)
        )
    }


    /* 如果没有弹出窗接口的权限 */
    if (!Settings.canDrawOverlays(main)) {
        if (flag) {
            load.confirm('当前应用未获得后台运行时的拨号权限，应用在后台运行时将无法进行拨号，您可以在点击确定后手动为应用打开该权限！', () => {
                main.startActivityForResult(action, 5004) // 转跳到悬浮窗设置
            });
        } else {
            main.startActivityForResult(action, 5004) // 转跳到悬浮窗设置
        }
    }
}