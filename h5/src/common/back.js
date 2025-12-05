/*
* @author 友人a丶
* @date 
* 
* */

import {useRouter} from "vue-router";
import eventUtil from '@/stores/event';
import {onUnmounted} from "vue";

export default function () {
    const router = useRouter();
    eventUtil.add('backbutton', router.back);
    onUnmounted(() => {
        eventUtil.remove('backbutton', router.back);
    })
}
