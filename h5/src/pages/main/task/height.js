/*
* @author 友人a丶
* @date 
* 
* */

import {computed, inject} from "vue";

export default function () {
    /* 高度 */
    const tabview = inject('tabView');
    return computed(() => {
        if (tabview.value) {
            return (tabview.value.getBoundingClientRect().height) + "px";
        } else {
            return "100%";
        }
    });
}
