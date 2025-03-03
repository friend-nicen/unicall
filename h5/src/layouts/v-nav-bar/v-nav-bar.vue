<script>
/* eslint-disable */
import {h, inject} from 'vue'
import {NavBar} from 'vant'
import "vant/es/nav-bar/style"
import setting from "@/stores/setting";
import NavRight from "./nav-right.vue";


/*
* 自动引入antd icon图标
* */

export default {
  props: {
    size: {
      default: '15px'
    }
  },
  setup(props, context) {

    const settings = setting(); //动态设置
    const nav_slots = inject("nav_slots");

    return () => {
      return h(NavBar, {}, {
        right: () => h(NavRight),
        left: () => h("span", {"innerHTML": settings.doc_title})
      });
    }

  }
}

</script>
