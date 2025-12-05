/**
 * 打开第三方APP
 */

import {ref} from "vue";
import images from "@/config/images";
import {useRouter} from "vue-router";

export default function () {

    /* 应用 */
    const app = ref([
        {
            title: "企查查",
            icon: images.qcc,
            type: "web",
            url: "https://www.qcc.com"
        },
        {
            title: "天眼查",
            icon: images.tian,
            type: "web",
            url: "https://www.tianyancha.com"
        }
    ]);


    /* 范访问 */
    const router = useRouter();

    /**
     * 访问
     */
    const open = (i) => {
        if (i.type === 'web') {
            router.push(`/browser?url=${i.url}&title=${i.title}`)
        } else {
            router.push(i.url)
        }
    }

    return {
        app,
        open
    }
}