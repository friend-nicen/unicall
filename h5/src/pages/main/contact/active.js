/*
* @author 友人a丶
* @date 
* 
* */

import {provide, ref} from "vue";
import load from "@/common/usual/load";
import axios from "axios";
import api from "@/service/api";

export default function (loadData) {

    const showPopover = ref(false);
    const showFollow = ref(false);
    const follow_customer = ref(null);


    provide("follow_customer", follow_customer);
    provide("showFollow", showFollow);

    const active = ref(null);//被选对象

    /* 操作 */
    const actions = [
        {name: '查看跟进记录'},
        {name: '新增跟进记录'},
        {name: '编辑客户信息'},
        {name: '删除选定客户', color: '#ee0a24'},
        {name: '取消当前操作'}
    ];

    /* 操作 */
    const showAction = (item) => {
        active.value = item; //被选对象
        showPopover.value = true; //显示操作
    }


    /* 标签弹出框 */
    const edit_visible = ref(false);
    const select_edit_customer = {data: null};


    const showAddFollow = ref(false);


    provide("edit_visible", edit_visible);
    provide("showAddFollow", showAddFollow);
    provide("select_edit_customer", select_edit_customer);


    /* 显示标签 */
    const showEdit = (item) => {
        select_edit_customer.data = item;
        edit_visible.value = true;
    }

    /**
     * 激活
     */
    const onActive = (option) => {

        /* 编辑 */
        if (option.name === "编辑客户信息") {
            showEdit(active.value);
        } else if (option.name === "查看跟进记录") {
            showFollow.value = true;
            follow_customer.value = active.value;
        } else if (option.name === "新增跟进记录") {
            showAddFollow.value = true;
            follow_customer.value = active.value;
        } else if (option.name === "删除选定客户") {

            /* 删除客户 */
            load.confirm("确定要删除当前客户？", () => {
                /* 显示加载效果 */
                load.loading("加载中...");
                try {
                    /* 开始请求 */
                    axios.post(api.del, {
                        id: active.value.id
                    }).then((res) => {
                        /*
                        * 判断请求结果
                        * */
                        if (res.data.code) {
                            /* 加载数据 */
                            loadData();
                            /* 弹出错误原因 */
                            load.success(res.data.errMsg);
                        } else {
                            /* 弹出错误原因 */
                            load.error(res.data.errMsg);
                        }
                    }).catch((e) => {
                        /* 弹出错误原因 */
                        load.error(e.message);
                    }).finally(() => {
                        /* 关闭加载效果 */
                        load.loaded();
                    });
                } catch (e) {
                    console.log(e)
                    load.error(e);
                }

            });
        }

        /* 关闭 */
        showPopover.value = false;
    }


    return {
        onActive,
        showAction,
        showPopover,
        active,
        actions,
        showEdit
    }
}
