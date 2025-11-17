/**
 * 打开第三方APP
 */

import {ref} from "vue";
import images from "@/config/images";

export default function () {
    return ref([
        {
            title: "企查查",
            icon: images.qcc,
            url: "https://www.qcc.com"
        },
        {
            title: "天眼查",
            icon: images.tian,
            url: "https://www.tianyancha.com"
        }
    ]);

}