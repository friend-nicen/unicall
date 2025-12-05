import axios from "axios";
import api from "@/service/api";
import load from "@/common/load";
import {provide} from "vue";
import {switchForm} from "@/common";

export default function () {

    const addCustomer = (item) => {
        try {
            if (!item || item.cid) return;
            axios.post(api.dial.create, switchForm({
                id: item.id,
                name: item.name || "",
                phone: item.phone
            }))
                .then((res) => {
                    if (res.data && res.data.code) {
                        item.cid = res.data.data;
                        load.toast(res.data.errMsg);
                    } else {
                        load.toast(res.data.errMsg);
                    }
                }).catch((e) => {
                load.toast(e.message);
            })
        } catch (e) {
            load.toast(e);
        }
    }

    provide('addCustomer', addCustomer);

    return {
        addCustomer
    }
}

