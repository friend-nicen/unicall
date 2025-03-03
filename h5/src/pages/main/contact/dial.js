/*
* @author 友人a丶
* @date 
* 
* */

import {reactive, ref} from "vue";

export default function () {

    const offset = reactive({
        x: window.innerWidth - 58,
        y: window.innerHeight - 108
    });

    const showDial = ref(false);

    return {
        offset,
        showDial
    }
}
