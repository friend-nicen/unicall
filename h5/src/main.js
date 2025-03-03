import {createApp} from 'vue'
import App from './App.vue'
import {createPinia} from "pinia"
import {router} from "./router/index";

//import VConsole from "vconsole";
//new VConsole();

/* 单独的样式 */
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/notify/style';
import 'vant/es/image-preview/style';

import batch____import from './utils/auto_import'
import goto____bootstrap from "./utils/bootstrap";

import  './mock';//接口模拟


/* 初始化vue */
let app = createApp(App);
app.use(createPinia());//状态管理器
app.use(router);//路由加载

batch____import(app);//批量导入组件
goto____bootstrap(); //引导系统初始化

app.mount('#app')
