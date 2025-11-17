/*
* @author 友人a丶
* @date 
* 设置导航栏
* */
import {inject, onDeactivated} from "vue";


export default function (render) {
    /* 依赖引入 */
    const nav_slots = inject("nav_slots");
    /* 定义导航栏 */
    nav_slots.data = render;
    /* 切换时清除 */
    onDeactivated(nav_slots.reset);
}