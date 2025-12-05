<template>
  <!-- 固定高度 -->
  <div :style="{height:height}" class="container">
    <div class="header">
      <v-place/>
      <van-nav-bar :title="$route.query.title"
                   left-arrow @click-left="close"/>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import sys from "@/stores/sys";
import {onBeforeUnmount, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import init____back from '@/common/back';

const height = sys.height + "px";
const router = useRouter();
const route = useRoute();
let wv;

/* 回退 */
init____back();

/* 关闭 */
const close = () => {
  if (wv) {
    wv.close();
  }
}
/* 状态栏高度 */
const statusHeight = plus.navigator.getStatusbarHeight() + 35;

/* 打开指定链接 */
const openWebview = async () => {

  /* 设置qcc UA */
  /* 设置为pcua */
  plus.navigator.setUserAgent('Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36', false);

  /* 加载企查查功能页面 */
  wv = plus.webview.open(route.query.url, '8848', {
    plusrequire: "none",
    popGesture: 'close',
    scalable: true,
    top: statusHeight + 'px'
  });


  /* 关联 */
  plus.webview.currentWebview().append(wv);

  /* 显示窗口 */
  wv.show();

  /*显示加载效果*/
  plus.nativeUI.showWaiting("加载中...");

  /*窗口加载完成，监听事件*/
  wv.addEventListener('loaded', () => {
    plus.nativeUI.closeWaiting();
  });

  /* 监听关闭 */
  wv.addEventListener('close', () => {
    router.back();
  });
}

/* 初始化 */
onMounted(() => openWebview());
onBeforeUnmount(close);
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;

  :deep(.header) {
    background-color: white;
    --van-nav-bar-background: white;
    --van-nav-bar-title-text-color: $text-color;
    --van-nav-bar-height: 35px;
    --van-nav-bar-icon-color: #333333;

    .van-nav-bar__left {
      font-size: 16px;
      font-weight: normal;
    }


    position: relative;
    flex-shrink: 0;
    z-index: 999;
  }
}
</style>
