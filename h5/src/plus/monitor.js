/* eslint-disable */
import api from "@/service/api";
import _user from "@/stores/user";
import invoke from "@/utils/bridge";
import {report} from "@/service/requests";

/*
* 通话录音监控和上传模块
* 
* 功能说明：
* - uniapp在Android11+系统中不支持plus api读取应用目录以外的系统文件目录
* - 需要通过native.js调用Java原生API来读取系统录音文件
* - 通过native调用Java读取时FileInputStream速度较慢，只能循环read()读取
* - JavaScript数据类型无法正常存储读取的二进制数据
* - 无法直接转换为HTML文件上传需要的blob对象
* 
* 解决方案：
* - 通过文件流的Channel将录音文件拷贝到应用可读取的目录
* - 然后调用HTML5Plus API上传文件，实现通话录音文件的读取和上传
* */


/**
 * 根据不同手机品牌获取录音文件存储目录
 */
export function getRecordPath() {
    return window.____brand[plus.device.vendor.toLowerCase()] || '/Recordings/';
}

/**
 * 上传录音文件到服务器
 * 使用HTML5Plus的上传API将录音文件上传到后端服务器
 * @param {string} file - 要上传的文件路径
 * @param {Object} param - 上传参数对象，包含通话信息
 * @returns {Promise<Object>} 上传结果的Promise对象，包含状态码和响应信息
 */
function upload(file, param) {

    /* 获取当前用户信息 */
    const user = _user();

    return new Promise(((resolve, reject) => {

        /* 创建文件上传任务 */
        const task = plus.uploader.createUpload(`${api.dial.upload}?call=${param.id}`, {
                method: "POST",
                priority: 100,
                retry: 3,
                retryInterval: 2
            },
            (ob, status) => {
                try {
                    /* 上报 */
                    report(`录音上传：${ob.responseText}，status：${status}，file：${file}`);
                    /* 判断结果 */
                    if (status === 200) {

                        /* 响应结果 */
                        const data = JSON.parse(ob.responseText);

                        if (data.code) {
                            resolve(true);
                        } else {
                            reject("上传失败：" + data.errMsg);
                        }
                    } else {
                        reject("上传失败：" + status);
                    }
                } catch (e) {
                    reject("上传失败：" + status);
                }
            }
        );

        /* 添加要上传的文件，使用file://协议 */
        task.addFile(`file://${file}`, {
            key: "audio",
            timeout: 120,
            retry: 2,
            retryInterval: 5
        });

        /* 设置用户认证token到请求头 */
        task.setRequestHeader("authorization", Array.isArray(user.token) ? user.token[0] : user.token);

        /* 开始执行上传任务 */
        task.start();


    }));

}


/**
 * 处理录音文件上传（简化版本）
 * 直接根据通话时间查找并上传录音文件，不获取通话记录
 * @param {number} callTime - 通话开始时间
 * @param {Object} param - 上传参数对象
 * @returns {Promise<Object>} 上传结果对象
 */
export async function handle(callTime, param) {

    try {

        /* 获取最新的录音文件 */
        const audio = await invoke({
            action: 'getLatestAudio',
            data: {
                latestTime: callTime
            }
        });

        /* 将录音文件复制到应用存储目录 */
        const last_audio = await invoke({
            action: 'copy',
            data: audio.file
        })

        /* 开始上传录音文件 */
        await upload(last_audio, param);

        /* 删除原文件，防止卡顿 */
        await invoke({
            action: 'unlink',
            data: audio.file
        })

        return {
            code: 1
        }

    } catch (e) {
        console.log(e);
        return {
            code: 0,
            msg: e
        };
    }
}


/**
 * 获取当前设备的通话状态
 * 通过TelephonyManager获取实时通话状态信息
 *
 * 返回值说明：
 * - 0: 空闲状态（无通话）
 * - 1: 来电响铃状态
 * - 2: 通话中状态（正在拨号、活动通话或保持状态）
 * @returns {number} 当前通话状态码
 */
let Context, teleManager;

export function getState() {

    if (!Context) {
        /* 导入其他必要的系统类 */
        /* 电话管理器类 */
        plus.android.importClass("android.telephony.TelephonyManager");
        /* Activity管理器类 */
        plus.android.importClass("android.app.ActivityManager");
        /* Android上下文类 */
        Context = plus.android.importClass("android.content.Context");
        /* 通话管理器 */
        teleManager = plus.android.runtimeMainActivity().getSystemService(Context.TELEPHONY_SERVICE);
    }

    /* 返回当前通话状态 */
    return teleManager.getCallState();
}
