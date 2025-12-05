import quit________system from "@/service/quit-system";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import {useWebSocket} from "@vueuse/core";
import {watch} from "vue";
import api from "@/service/api";
import _user from "@/stores/user";
import wsStore from "@/stores/ws";
import load from "@/common/load";


/* 创建并连接 WebSocket，同时同步状态到 wsStore */
export function connectWs() {

    /* 避免重复连接 */
    if (wsStore.ws && wsStore.online) {
        return;
    }

    /* 用户信息 */
    const user = _user();

    /* 链接websocket */
    const {
        status,
        data,
        close,
        open,
        send,
        ws
    } = useWebSocket(api.ws, {
        async onConnected(ws) {

            /* 是否初始化了浏览器指纹 */
            if (!user.finger) {
                /* 获取指纹 */
                user.finger = await FingerprintJS.load()
                    .then(fp => fp.get({}))
                    .then(result => result.visitorId);
            }

            ws.send(JSON.stringify({
                type: 'login',
                corp: user.corp.id,
                name: user.username,
                finger: user.finger
            }));
        },
        onMessage(ws, event) {

            /* 接受数据 */
            if (event.data === "1") return;
            const data = JSON.parse(event.data);

            /* 登录同一个账号，退出登录 */
            if (data.type === "quit" && data.finger !== user.finger) {
                quit________system(false);
                return load.info('您的账号在别处登录');
            } else if (data.type === "call") {
                /* 封装打电话的逻辑 */
                /*call({phone: data.phone});*/
            }

        },
        heartbeat: {
            interval: 2000
        },
        immediate: true,
        autoClose: false,
        autoReconnect: {
            retries: () => true,
            delay: 2000
        }
    });


    /* 写入 wsStore 状态引用与方法 */
    wsStore.status = status;
    wsStore.data = data;
    wsStore.close = close;
    wsStore.open = open;
    wsStore.send = send;
    wsStore.ws = ws;

    /* 同步 online 状态 */
    wsStore.online = status.value === 'OPEN';

    /* 监听状态变化 */
    watch(status, (s) => {
        wsStore.online = s === 'OPEN';
    }, {
        immediate: true
    });
}

/* 断开 WebSocket 连接；reset=true 时重置存储状态 */
export function disconnectWs(reset = false) {
    if (typeof wsStore?.close === 'function') {
        wsStore.close();
    }
    if (reset) {
        wsStore.status = null;
        wsStore.data = null;
        wsStore.close = null;
        wsStore.open = null;
        wsStore.send = null;
        wsStore.ws = null;
        wsStore.online = false;
    } else {
        wsStore.online = false;
    }
}

/* 切换在线/离线状态 */
export function toggleWs() {
    if (wsStore.online) {
        disconnectWs(false);
    } else {
        connectWs();
    }
}

/* 初始化监听：监控用户 token 登录与退出，自动建立/关闭 ws */
export default function initWsWatch() {
    /* 用户信息 */
    const user = _user();
    /* 监听 token 变化：有值则连接，无值则关闭并重置 */
    watch(() => user.token, (token) => {
        if (token) {
            connectWs();
        } else {
            disconnectWs(true);
        }
    }, {immediate: true});
}
