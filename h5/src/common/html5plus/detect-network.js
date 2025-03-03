import load from "@/common/usual/load";


/**
 * 检测网络状态
 */
export default function () {
    /* 如果网络状态不是wifi */
    if (plus.networkinfo.getCurrentType() !== plus.networkinfo.CONNECTION_WIFI) {
        load.info("检测到您当前的网络状态不是wifi，为保证软件运行正常建议您使用wifi网络！");
    }
}