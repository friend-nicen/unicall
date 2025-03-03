<template>

  <van-popup
      v-model:show="label_visible"
      closeable
      round
      position="bottom"
      :style="{ height: '50%' }"
  >

    <div class="label" v-if="loaded">

      <template v-if="labels.length > 0">

        <!-- 标题 -->
        <div class="title">{{ select_customer.data.name }}</div>

        <ul class="label-list">

          <template v-for="item of labels" :key="item.value">

            <li class="label" @click="toglleLabel(item.value)" :class="{active:label.indexOf(item.value) > -1}">
              {{ item.label }}
            </li>

          </template>


        </ul>

        <van-button plain size="small" round type="primary" @click="modify" class="bottom-button">修改标签</van-button>

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

const label_visible = inject('label_visible');
const select_customer = inject('select_customer');
const loaded = ref(false); //数据是否已加载
const labels = inject("labels"); //所有标签
const label = ref([]); //用户已经标记的标签


/*
* 加载个人的标签
* */
const loadLabel = () => {
  try {
    /* 开始请求 */
    axios.get(api.load_label + `?customer=${select_customer.data.id}`)
        .then((res) => {
          /*
          * 判断请求结果
          * */
          if (res.data.code) {
            label.value = res.data.data;
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
* 添加删除标签
* */
const toglleLabel = (item) => {

  const index = label.value.indexOf(item);

  /* 添加 */
  if (index == -1) {
    label.value.push(item);
  } else {
    label.value.splice(index, 1);
  }
}


/*
* 修改标签
* */
const modify = () => {
  /* 显示加载效果 */
  load.loading("加载中...");

  try {
    /* 开始请求 */
    axios.post(api.modify_label, {
      customer: select_customer.data.id,
      label: label.value
    }).then((res) => {
      /*
      * 判断请求结果
      * */
      if (res.data.code) {
        /* 关闭显示 */
        label_visible.value = false;
        load.success("修改成功");
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

/*
* 检测
* */
watch(() => label_visible, () => {
  if (label_visible.value) {
    loadLabel();
  }
}, {
  deep: true
})

</script>

<style lang="scss" scoped>

.label {
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
    padding: 15px;

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