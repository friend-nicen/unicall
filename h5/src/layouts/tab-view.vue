<template>
  <!-- 固定高度 -->
  <div class="tab-container">

    <!--  可滚动视图区  -->
    <div class="tab-view" ref="tabView">


      <router-view v-slot="{Component}">
        <keep-alive>
          <component :is="Component" :key="$route.meta.cache_2"/>
        </keep-alive>
      </router-view>


    </div>

    <van-tabbar :fixed="false" :active-color="$theme['primary-color']" route :safe-area-inset-bottom="true">
      <template v-for="i of routes" :key="i.path">
        <van-tabbar-item :name="i.path" replace :to="i.path" :icon="i.meta.icon">{{ i.meta.name }}</van-tabbar-item>
      </template>
    </van-tabbar>

  </div>

</template>


<script setup>

/*
* @author 友人a丶
* @items 所属的所有路由项
* @selectedKeys 选中的菜单
* 根据路由自动生成菜单的架子
* */

import {getChildren} from "@/router/common";
import {computed, provide, ref} from "vue";
import {useRouter} from 'vue-router';

console.log("Tab框架初始化...");

/*路由对象*/
const router = useRouter();

/* 显示哪个路由下面的菜单 */
const props = defineProps({
  route: {
    default: '/main'
  }
});

/*获取路由项*/
const routes = computed(() => {

  /*
  * 如果传递了route参数
  *
  * 如果没传递值，默认获取当前路由
  * */
  if (props.route !== "") {
    const childs = getChildren(props.route);
    return !childs ? [] : childs
  } else {
    /*
      * 获取当前路由匹配的所有路由
      * 最后一个为最终匹配
      * */
    const matched = router.currentRoute.value.matched;

    /*
    * 循环获取顶级父路由
    * 排除掉 “/” 路由
    * 从第一个非 “/” 的路由开始
    * */
    for (let i = 0; i < matched.length; i++) {
      if (matched[i].path != '/') {
        return getChildren(matched[i].path);
      }
    }

  }

  return [];

});


/* DOM注入 */
const tabView = ref(null);
provide("tabView", tabView);//依赖注入

</script>


<style lang="scss" scoped>
.tab-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;

  .tab-view {
    overflow: auto;
    height: 100%;
  }

  :deep(.van-tabbar) {
    flex-shrink: 0;
    border-top: solid $border-color 1px;
    --van-tabbar-item-text-color: #444444;

    .van-tabbar-item__text {
      font-weight: bold;
    }

    .van-icon {
      &::before {
        font-size: 16px;
      }
    }

    .van-tabbar-item {
      color: $sub-text-color;

      * {
        color: inherit;
      }
    }

  }
}
</style>
