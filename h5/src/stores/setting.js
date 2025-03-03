/*
* @author 友人a丶
* @date 2022-07-11
* 系统动态设置
* */

import {defineStore} from "pinia";

const setting = defineStore('setting', {
    state() {

        /*初始数据列表*/
        return {
            doc_title: null, //导航栏标题
            record_audio: false,//是否需要录制音频
        }
    },
    actions: {
        /*
        * 切换显示
        * */
        toggleRecord(status) {
            this.record_audio = status;
        }
    }
})

export default setting;