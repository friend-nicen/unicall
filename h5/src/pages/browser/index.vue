<template>
  <!-- 固定高度 -->
  <div :style="{height:height}" class="container">
    <div class="header">
      <v-place/>
      <van-nav-bar left-arrow
                   @click-left="close" :title="$route.query.title"/>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import sys from "@/stores/sys";
import {onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import load from "@/common/load";

const height = sys.height + "px";
const router = useRouter();
const route = useRoute();
let wv;

/* 关闭 */
const close = () => {
  if (wv) {
    wv.close();
  } else {
    load.toast('组件异常..');
  }
}
/* 状态栏高度 */
const statusHeight = plus.navigator.getStatusbarHeight() + 35;

/*显示加载效果*/
plus.nativeUI.showWaiting("加载中...");

/* 打开指定链接 */
const openWebview = async () => {

  /* 设置qcc UA */
  /* 设置为pcua */
  plus.navigator.setUserAgent('Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36', false);

  /* 加载企查查功能页面 */
  wv = plus.webview.open(route.query.url, '8848', {
    popGesture: 'close',
    scalable: true,
    top: statusHeight + 'px'
  });

  /* 显示窗口 */
  wv.show();

  /*窗口加载完成，监听事件*/
  wv.addEventListener('loaded', () => {
    /* 注入JavaScript代码 */
    const injectedJs = `window.initialize = () => {
                    plus.key.addEventListener("backbutton", function () {
                            history.back();
                       });
          }


				 /*如果plus未初始化，择监听plusready事件*/
					if (typeof plus == "undefined") {
						document.addEventListener("plusready", window.initialize);
					} else {
						window.initialize();
					}
				`;
    wv.evalJS(injectedJs);
    plus.nativeUI.closeWaiting();
  });

  /* 监听关闭 */
  wv.addEventListener('close', () => {
    router.back();
  });
}

/* 初始化 */
onMounted(() => openWebview());
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
