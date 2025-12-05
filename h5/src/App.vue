<template>
  <router-view/>
</template>

<script setup>
import {provide} from "vue";
import {store} from "@/common";

document.body.style.minHeight = window.innerHeight + "px";
document.body.style.height = "100vh";

/* 动态注入插槽 */
provide("nav_slots", store({}));
</script>

<style lang="scss">

@import "@/theme/iconfont.scss";

:root:root {
  --van-primary-color: rgb(255, 125, 0);
}

/* 全局背景色 */
body {
  margin: 0 auto !important;
  padding: 0;
  background-color: #f7f7f7 !important;

  overflow: hidden;
  overscroll-behavior: none;
  /* 禁止IOS页面缩放 */
  touch-action: none;
  transform: rotate(0);
  max-width: 1000px;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.1);

  #app {
    height: inherit;
  }

  .self-popup {
    background-color: #f7f7f7 !important;
  }

  .van-floating-bubble {
    border: 1px solid rgba(#000000, 0.2);
    box-shadow: 1px 2px 12px rgba(#000000, 0.3);
  }

  /* 主题色修改 */
  --van-dialog-confirm-button-text-color: rgb(255, 125, 0);
  --van-notify-line-height: 32px;
  --van-tabbar-height: 60px;
}

</style>
