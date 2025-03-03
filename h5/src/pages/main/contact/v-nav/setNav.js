/* eslint-disable */
import setNavbar from "@/common/usual/set-navbar";
import {h} from 'vue'
import NavRight from './nav-right.vue'

export default function () {
    /*设置导航栏*/
    setNavbar({
        right: () => h(NavRight)
    });
}