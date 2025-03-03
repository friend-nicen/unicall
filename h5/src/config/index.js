/*
* @author 友人a丶
* @date 2022-07-11
* 系统基础设置
* */


export default {
    index: '/main/contact', //默认首页
    /*权限验证模式*/
    auth: {
        mode: 'token', //token、cookie
        token: 'Authorization' //认证头的名字
    }
}