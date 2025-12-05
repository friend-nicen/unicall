/*
* @author 友人a丶
* @date
* */
import call from "@/utils/call";
import {provide} from "vue";

export default function () {

    /* 注入方法 */
    provide('call', call);

    return {
        call
    }

}