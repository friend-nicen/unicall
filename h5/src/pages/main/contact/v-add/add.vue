<template>

  <van-popup
      v-model:show="follow_visible"
      closeable
      round
      position="bottom"
      :style="{ height: '50%' }"
  >


    <div class="follow">

      <!-- 标题 -->
      <div class="title">{{ select_customer.name }}</div>

      <van-field autosize placeholder="请输入跟进记录" rows="8" type="textarea"
                 v-model="follow"
                 label=""/>

      <van-button plain size="small" round type="primary" @click="addFollow" class="bottom-button">确认新增</van-button>


    </div>

  </van-popup>

</template>

<script setup>
import {inject, ref} from "vue";
import api from "@/service/api";
import axios from "axios";
import load from "@/common/usual/load";

const follow_visible = inject('showAddFollow');
const select_customer = inject('follow_customer');
const follow = ref("");

/*
* 加载个人的标签
* */
const addFollow = () => {
  try {

    if(!follow.value){
      load.error("内容不能为空！");
      return;
    }

    /* 测试 */
    load.loading();
    /* 开始请求 */
    axios.post(api.add_follow, {
      info: follow.value,
      id: select_customer.value.id
    })
        .then((res) => {
          /*
          * 判断请求结果
          * */
          if (res.data.code) {
            load.success(res.data.errMsg);
            follow_visible.value = false;
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
    });

  } catch (e) {
    console.log(e)
    load.error(e);
  }
}

</script>

<style lang="scss" scoped>

.follow {
  display: flex;
  flex-direction: column;
  padding: 0;
  height: 100%;
  overflow: hidden;
  position: relative;

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

    .tip {
      span {
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
    position: absolute;
    bottom: 10px;
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