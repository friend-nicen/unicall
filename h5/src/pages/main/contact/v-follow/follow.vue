<template>

  <van-popup
      v-model:show="follow_visible"
      closeable
      round
      position="bottom"
      :style="{ height: '50%' }"
  >

    <div class="follow" v-if="loaded">

      <template v-if="follows.length > 0">

        <!-- 标题 -->
        <div class="title">{{ select_customer.name }}</div>


        <van-steps direction="vertical" class="label-list">

          <template v-for="item of follows" :key="item.id">

            <van-step>
              <h3>{{ item.info }}</h3>
              <p class="tip">
                <span>
                  {{ item.nickname }}
                </span>
                <span>
                  {{ item.datetime }}
                </span>
              </p>
            </van-step>
          </template>

        </van-steps>

      </template>

      <van-empty v-else description="暂无数据"/>

    </div>

    <div v-else class="skeleton">
      <van-skeleton title :row="5"/>
    </div>

  </van-popup>

</template>

<script setup>
import {inject, watch, ref} from "vue";
import api from "@/service/api";
import axios from "axios";
import load from "@/common/usual/load";

const follow_visible = inject('showFollow');
const select_customer = inject('follow_customer');
const loaded = ref(false); //数据是否已加载
const follows = ref([]); //所有标签


/*
* 加载个人的标签
* */
const loadFollow = () => {
  try {

    /* 开始请求 */
    axios.get(api.load_follow + `?id=${select_customer.value.id}`)
        .then((res) => {
          /*
          * 判断请求结果
          * */
          if (res.data.code) {
            follows.value = res.data.data;
          } else {
            /* 弹出错误原因 */
            load.error(res.data.errMsg);
          }
        }).catch((e) => {
      /* 弹出错误原因 */
      load.error(e.message);
    }).finally(() => {
      /* 关闭加载效果 */
      load.loaded();
      loaded.value = true;
    });

  } catch (e) {
    console.log(e)
    load.error(e);
  }
}


/*
* 检测
* */
watch(() => follow_visible.value, () => {
  if (follow_visible.value) {
    loadFollow();
  }
}, {
  deep: true
})

</script>

<style lang="scss" scoped>

.follow {
  display: flex;
  flex-direction: column;
  padding: 0;
  height: 100%;
  overflow: hidden;

  .title {
    width: 100%;
    height: 50px;
    flex-shrink: 0;
    @include flex-center;
    color: $sm-color;
    font-size: $font-size-1;
  }

  .label-list {
    list-style: none;
    margin: 0;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 15px 15px 15px 35px;

    :deep(h3) {
      margin: 0;
    }

    .tip{
      span{
        margin-right: 5px;
      }
    }

    .label {
      display: inline-flex;
      height: fit-content;
      margin: 5px 8px;
      background-color: #f7f7f7;
      border-radius: 5px;
      color: $sub-text-color;
      font-size: $font-size-5;
      padding: 6px 15px;
      white-space: nowrap;
      border: 1px solid transparent;
    }

    .active {
      background-color: rgba($primary-color, 0.1);
      color: $primary-color;
      border: 1px $primary-color solid;
    }
  }

  .bottom-button {
    flex-shrink: 0;
    padding: 10px 30px;
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
    border: 1px $primary-color solid;
    margin: 20px 15% 15px;
    width: 70%;
  }

}


.skeleton {
  padding: 30px 5px;
  --van-skeleton-paragraph-background: #e3e3e3;
}

</style>