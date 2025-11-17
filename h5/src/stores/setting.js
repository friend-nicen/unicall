/*
* @author 友人a丶
* @date 2022-07-11
* 系统动态设置
* */

import {defineStore} from "pinia";

const setting = defineStore('setting', {
    state() {
        /* 初始数据列表 */
        return {
            title: null, //导航栏标题
            record: false,//是否需要录制音频
        }
    },
    actions: {
        /* 切换模式 */
        toggleRecord(status) {
            this.record = status;
        }
    }
})

export default setting;