/**
 * 通话录音状态改变时的回调
 * @param callback
 */
export function getCallStatus(callback) {
    if (!plus || !plus.android) return;
    let maintest = plus.android.runtimeMainActivity();
    let Contexttest = plus.android.importClass("android.content.Context");
    let telephonyManager = plus.android.importClass("android.telephony.TelephonyManager");
    let telManager = plus.android.runtimeMainActivity().getSystemService(Contexttest.TELEPHONY_SERVICE);
    let receiver = plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {
        onReceive: (Contexttest, intent) => {
            plus.android.importClass(intent);
            let phoneStatus = telManager.getCallState();
            callback && callback(phoneStatus);
            //电话状态 0->空闲状态 1->振铃状态 2->通话存在
        }
    });
    let IntentFilter = plus.android.importClass("android.content.IntentFilter");
    let filter = new IntentFilter();
    filter.addAction(telephonyManager.ACTION_PHONE_STATE_CHANGED);
    maintest.registerReceiver(receiver, filter);
}
