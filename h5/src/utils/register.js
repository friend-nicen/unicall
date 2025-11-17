/**
 * @author 友人a丶
 * @date
 * 注册Vue全局方法
 * */
import _user from "@/stores/user";
import api from "@/service/api";
import images from "@/config/images";
import {auth} from "@/common/func";
import theme from "@/config/theme";
import invoke from "@/utils/bridge";


/**
 * 注册vue的全局方法
 * @param app {object}
 */
export default function (app) {
    app.config.globalProperties.$user = _user();
    app.config.globalProperties.$auth = auth;
    app.config.globalProperties.$theme = theme;
    app.config.globalProperties.$images = images;
    app.config.globalProperties.$api = api;
    app.config.globalProperties.$invoke = invoke;

}