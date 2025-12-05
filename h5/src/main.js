import {createApp} from 'vue'
import App from './App.vue'
import {createPinia} from "pinia"
import {router} from "./router/index";
import init_____ws from "@/utils/socket";
/* 控制台 */
import VConsole from "vconsole";

/* 是否显示 */
if (window.vconsole_visible) new VConsole();


/* 单独的样式 */
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/notify/style';
import 'vant/es/image-preview/style';

import batch____import from './utils/import'
import goto____bootstrap from "./utils/bootstrap";
import register____global from "@/utils/register";

/* 初始化vue */
let app = createApp(App);

/* 状态管理器 */
app.use(createPinia());

/* 路由加载 */
app.use(router);

/* 批量导入组件 */
batch____import(app);

/* 引导系统初始化 */
goto____bootstrap();
register____global(app);

/* 初始化 WebSocket 监听 */
init_____ws();

app.mount('#app')
