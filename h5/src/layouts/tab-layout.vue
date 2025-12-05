<template>
  <!-- 固定高度 -->
  <div class="tab-container">

    <!--  可滚动视图区  -->
    <div ref="tabView" class="tab-view">


      <router-view v-slot="{Component}">
        <keep-alive>
          <component :is="Component" :key="$route.meta.cache_2"/>
        </keep-alive>
      </router-view>


    </div>

    <van-tabbar :active-color="$theme['primary-color']" :fixed="false" :safe-area-inset-bottom="true" route>

      <template v-for="(i,k) of routes" :key="i.path">
        <van-tabbar-item class="icon-button" v-if="k === 2">
          <div class="fab-keypad" @click="showKeypad = true">
            <span class="icon icon-bohaopan bohao"></span>
          </div>
        </van-tabbar-item>
        <van-tabbar-item :icon="i.meta.icon" :name="i.path" :to="i.path" replace>{{ i.meta.name }}</van-tabbar-item>
      </template>
    </van-tabbar>

  </div>


  <!-- 拨号 -->
  <v-keypad v-model:show="showKeypad"/>

</template>


<script setup>

/*
* @author 友人a丶
* @items 所属的所有路由项
* @selectedKeys 选中的菜单
* 根据路由自动生成菜单的架子
* */

import {getChildren} from "@/router/common";
import {computed, ref} from "vue";
import {useRouter} from 'vue-router';
import {provides} from "@/common";

console.log("Tab框架初始化...");

/*路由对象*/
const router = useRouter();
const showKeypad = ref(false);

/* 显示哪个路由下面的菜单 */
const props = defineProps({
  route: {
    default: '/main'
  }
});

/* 获取路由项 */
const routes = computed(() => {

  /**
   * 如果传递了route参数
   * 如果没传递值，默认获取当前路由
   * */
  if (props.route !== "") {
    const childs = getChildren(props.route);
    return !childs ? [] : childs
  } else {
    /**
     * 获取当前路由匹配的所有路由
     * 最后一个为最终匹配
     * */
    const matched = router.currentRoute.value.matched;

    /**
     * 循环获取顶级父路由
     * 排除掉 “/” 路由
     * 从第一个非 “/” 的路由开始
     * */
    for (let i = 0; i < matched.length; i++) {
      if (matched[i].path !== '/') {
        return getChildren(matched[i].path);
      }
    }

  }

  return [];

});


/* DOM注入 */
const tabView = ref(null);

/* 依赖注入 */
provides({
  showKeypad,
  tabView
});

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
    border: none;
    --van-tabbar-item-text-color: #444444;
    box-shadow: 0 -3.5px 12px 0 hsla(0, 0%, 64%, .2);

    &:after {
      border: none;
    }


    .van-icon {
      &::before {
        font-size: 21px;
      }
    }

    .van-tabbar-item {
      color: #444444;

      * {
        color: inherit;
      }
    }

  }
}


.icon-button {
  position: relative;

  &::before {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI4AAAAtCAMAAABPq6N6AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAkUExURaqqqrOzs0xpcaioqKampvPz8+zs7Pz8/Pn5+d3d3f7+/v///zC/xUkAAAALdFJOUwoFACIVmXnWuVbsWW1REwAAAhdJREFUWMPtl8l2wyAMReUaA4b//996AiSBMZOTLvrSRTap77nCwIOfPxXo+/nEPl/DOR6//7H0UUEzSS7NTNACQwI+EdLrOJjFQQD70mMJ2kZEOBIJQO/ZiaazRWwfEHuOL1hUiyGoNeOsiBMiEQ8FyNA01g4Vc8+SIRqDE8xELHOcmKjqPYNaMxmUBBMGGoFDzVxi/HNXuWiljLHWGKX0IldKBBioRBCU7TTYjCPRG0Ucox0TNlQqCEpWDTJzPukGBSEFIhAVgqBg2QQzp5cly3IRLWtQhHjacaYkjFS2MEoGQx7owQ8UqfFzKocJQDWCoNTNMaYqmANoJYIeeaBw2ez/VduGaCLoaUHDoxs/J2ObYtzEsJ+pCgdtNl1qmKCwoGvtMJrV2I6YNeKZynGom2NQtjPRwGrs8GWz2O4sEc9UhJNYxANoAo/IvvBw/4IPpUn4SQmCx71vEA3zcyMI7u427owaRnPxzOzOMaVwyN0cqRlJg3gEaT8ICWirBHZ+D6WJeHBFPI1A3G+FH1TPVpzZoOfo3hoIeJdDl776A7z0iJ9p+4FE4edz6jwYsgdGuNvDbb0W5Go+flB0YDMviKxpu/503UGNfS1G3nZE2m59f1L21aiVA7nZxSyvwxAgigR+PC7yAzCoaDim6wJL27XU9oPRkrd7wH1b2Y9HoV6/4yx7tP4CCWLSeoOQW8D+qfzj5PILImCLlJBdwN8AAAAASUVORK5CYII=);
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: contain;
    content: "";
    height: 27px;
    position: absolute;
    top: -22px;
    width: 60px;
    z-index: 5;
  }

  .fab-keypad {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-top: -36px;
    background-color: $primary-color;
    border: 1px solid #eaeaea;
    @include flex-center;
    position: relative;
    z-index: 18;

    .bohao {
      color: #ffffff !important;
      font-size: 16px;
      font-weight: bold;
      z-index: 10;
    }

  }


}


</style>
