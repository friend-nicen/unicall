<template>
  <router-view/>
</template>

<script setup>
import {provide} from "vue";
import {store} from "@/common/usual/common";

document.body.style.minHeight = window.innerHeight + "px";
document.body.style.height = window.innerHeight + "px";

provide("nav_slots", store({}));//动态注入插槽
</script>

<style lang="scss">

:root:root {
  --van-primary-color: #fa541c;
}

/*全局背景色*/
body {
  margin: 0 auto !important;
  padding: 0;
  background-color: #f7f7f7 !important;

  overflow: hidden;
  overscroll-behavior: none;
  transform: rotate(0);
  max-width: 420px;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.1);


  #app {
    height: inherit;
  }


  .self-popup {
    background-color: #f7f7f7 !important;
  }


  /* 主题色修改 */
  --van-dialog-confirm-button-text-color: #fa541c;
  --van-notify-line-height: 32px;
}

</style>
