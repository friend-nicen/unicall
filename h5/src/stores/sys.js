/*
* @author 友人a丶
* @date 2022-07-11
* 系统运行时静态配置
* */
export default {
    plus_ready: false, //Plus对象是否已经初始化
    app_ready: false, //是否已经初始化应用
    sys_ready: false, //系统是否已经初始化
    height: window.innerHeight, //初始化高度
    debug: true, //是否开启调试模式
    network: true, //是否检测网络
    overlay: false //是否检测后台弹出权限
};