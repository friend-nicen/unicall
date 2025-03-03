<template>
  <!-- 固定高度 -->
  <div class="container" :style="{height:height}">

    <!--占位-->
    <div class="header">
      <v-place/>
      <v-nav-bar/>
    </div>


    <!--  可滚动视图区  -->
    <div class="view">
      <router-view v-slot="{Component}">
        <keep-alive>
          <component :is="Component" :key="$route.meta.cache_1"/>
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import system from "@/stores/system";

const height = system.init_height + "px";

console.log("主框架初始化...");
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  overflow: hidden;


  :deep(.header) {
    background-color: white;
    --van-nav-bar-background: white;
    --van-nav-bar-title-text-color: $text-color;
    --van-nav-bar-height: 35px;

    .van-nav-bar__left {
      font-size: 16px;
      font-weight: normal;
    }


    position: relative;
    flex-shrink: 0;
    z-index: 999;
  }

  .view {
    overflow: auto;
    transform: scale(1);
    height: 100%;
  }
}
</style>
