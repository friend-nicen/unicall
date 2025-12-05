/* 模块状态 */
let loaded, Context, ActivityManager

/**
 * 后台应用弹出到前台
 */
export function moveTop() {
    /* 活动示例对象管理 */
    if (!loaded) {
        plus.android.importClass("android.app.ActivityManager");
        Context = plus.android.importClass("android.content.Context");
        ActivityManager = plus.android.runtimeMainActivity().getSystemService(Context.ACTIVITY_SERVICE); //获取activity管理器
        loaded = true;/* 标记初始化 */
    }
    /* 当前的activety */
    const main = plus.android.runtimeMainActivity();
    /* 弹出窗口 */
    ActivityManager.moveTaskToFront(main.getTaskId(), 0);
}

