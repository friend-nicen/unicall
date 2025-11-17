/**
 * NativeBridge.es6.js
 * ES Module，action 级回调，默认 15 s 超时
 * import { invoke } from './NativeBridge.es6.js';
 * await invoke({ action:'getDeviceId', timeout:10_000 });
 */
const pool = Object.create(null);   // action -> {resolve, reject, timer}

/**
 * App 回传结果的唯一全局钩子
 * 调用方式（Android）：
 * webView.evaluateJavascript('window.__onCall(\'{"action":"getDeviceId","success":true,"payload":"fake-123"}\')', null);
 * payload 可省略。
 */
window.__onCall = function (json) {
    try {
        const {action, success, payload} = JSON.parse(json);
        /* 格式非法，直接丢弃 */
        if (typeof action !== 'string') return;

        const item = pool[action];
        /* 已超时或重复回调 */
        if (!item) return;

        const {resolve, reject, timer} = item;
        clearTimeout(timer);
        delete pool[action];

        success ? resolve(payload) : reject(new Error(payload ?? 'native error'));
    } catch {
        /* 非合法 JSON，直接忽略 */
    }
};

/**
 * 调用 App 内部方法
 * @param {Object} opt
 * @param {string} opt.action   - 必填，方法名
 * @param {any}    [opt.params] - 选填，参数，默认空对象
 * @param {number} [opt.timeout=15000] - 选填，超时毫秒
 * @returns {Promise<any>}
 */
export default function invoke(opt = {}) {

    /* 默认配置 */
    const {action, data = {}, timeout = 15000} = opt;

    /* 参数校验 */
    if (typeof action !== 'string' || !action)
        return Promise.reject(new TypeError('action is required'));

    return new Promise((resolve, reject) => {

        /* 如果已存在同 action 的未完成调用，先清掉 */
        if (pool[action]) {
            clearTimeout(pool[action].timer);
            pool[action].reject(new Error('covered by new call'));
        }

        /* 超时器，防止调用超时 */
        const timer = setTimeout(() => {
            delete pool[action];
            reject(new Error(`invoke ${action} timeout`));
        }, timeout);

        /* 回调 */
        pool[action] = {resolve, reject, timer};

        /* 发送消息 */
        uni.postMessage({
            data: {
                action,
                data: data
            }
        });

    });
}
