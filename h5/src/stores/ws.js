import {reactive} from "vue";

/* ws 全局状态存储 */
window.__ws = reactive({
    /* 当前连接状态：来自 useWebSocket 的 status ref */
    status: null,
    /* 最近消息数据：来自 useWebSocket 的 data ref */
    data: null,
    /* 关闭连接的方法 */
    close: null,
    /* 打开连接的方法 */
    open: null,
    /* 发送消息的方法 */
    send: null,
    /* 原始 WebSocket 实例 */
    ws: null,
    /* 是否在线（便于 UI 显示与切换） */
    online: false
});


export default window.__ws;