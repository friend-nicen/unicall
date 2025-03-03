import {nextTick, onMounted, onUnmounted, provide, ref} from "vue";
import load from "@/common/usual/load";
import ClipboardJS from "clipboard"

export default function () {

    let text = ref(''); //复制的文本
    let copy_dom = ref(null); //复制dom


    let clip = null;

    onUnmounted(() => {
        clip.destroy();
    })


    provide("text", text); //提供到下级组件
    provide("copy_dom", copy_dom); //提供到下级组件

    onMounted(() => {
        clip = new ClipboardJS(copy_dom.value);
        clip.on("success", () => {
            load.success("复制成功！")
        })
        clip.on("error", () => {
            load.toast_error("复制失败！")
        })
    });

    /* 复制 */
    const copy = (source) => {

        text.value = source;

        return nextTick(() => {
            copy_dom.value.click();
        })
    }


    return {
        text,
        copy_dom,
        copy
    }


}