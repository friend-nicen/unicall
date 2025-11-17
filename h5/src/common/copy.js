import {onMounted, onUnmounted, ref} from "vue";
import ClipboardJS from "clipboard"
import {delay} from "lodash";

export default function (callback) {

    let elem = document.createElement('span');
    const copied = ref(false);

    let clip = null;

    onUnmounted(() => {
        clip.destroy();
        elem = null;
    });

    onMounted(() => {
        clip = new ClipboardJS(elem);
        clip.on("success", () => {
            copied.value = true;
            delay(() => {
                copied.value = false;
            }, 1500);
            if (callback && callback.success) callback.success();
        });
    });

    /* 触发复制 */
    return {
        copy: (text) => {
            elem.setAttribute('data-clipboard-text', text);
            elem.click();
        },
        copied: copied
    }
}