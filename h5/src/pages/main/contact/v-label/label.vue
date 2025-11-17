<template>

  <van-popup
      v-model:show="visible"
      :style="{ height: '45%' }"
      closeable
      destroy-on-close
      position="bottom"
      round
      teleport="body"
      @closed="customer = null">

    <div v-if="customer" class="label">
      <template v-if="labels.length > 0">
        <div class="title">{{ customer.name }}</div>
        <ul class="label-list">
          <template v-for="item of labels" :key="item.value">
            <li :class="{active:label.indexOf(item.value) > -1}" class="label" @click="toggleLabel(item.value)">
              {{ item.label }}
            </li>
          </template>
        </ul>
        <van-button class="bottom-button" plain round size="small" type="primary" @click="modify">修改标签</van-button>
      </template>
      <van-empty v-else description="暂无数据"/>
    </div>


  </van-popup>

</template>

<script setup>
import {ref, watch} from "vue";
import api from "@/service/api";
import axios from "axios";
import load from "@/common/load";
import {injects} from "@/common";

/* 事件 */
const visible = ref(false);


/* 状态 */
const {
  select_customer: customer,
  labels
} = injects([
  'select_customer',
  'labels'
]);


/* 用户已经标记的标签 */
const label = ref([]);


/**
 * 加载个人的标签
 */
const loadLabel = () => {
  try {
    /* 显示加载效果 */
    load.loading("加载中...");
    /* 开始请求 */
    axios.get(api.label.lists + `?id=${customer.value.id}`)
        .then((res) => {
          /* 判断请求结果 */
          if (res.data.code) {
            label.value = res.data.data;
            visible.value = true;
          } else {
            /* 弹出错误原因 */
            load.toast(res.data.errMsg);
          }
        }).catch((e) => {
      /* 弹出错误原因 */
      load.toast(e.message);
    }).finally(() => {
      /* 关闭加载效果 */
      load.loaded(0, true);
    });

  } catch (e) {
    console.log(e)
    load.toast(e);
  }
}

/**
 * 添加删除标签
 * @param item
 */
const toggleLabel = (item) => {
  const index = label.value.indexOf(item);
  /* 添加 */
  if (index === -1) {
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
    axios.post(api.label.modify, {
      id: customer.value.id,
      labels: label.value
    }).then((res) => {
      /* 判断请求结果 */
      if (res.data.code) {
        /* 关闭显示 */
        visible.value = false;
        load.toast("修改成功");
      } else {
        /* 弹出错误原因 */
        load.toast(res.errMsg);
      }
    }).catch((e) => {
      /* 弹出错误原因 */
      load.toast(e.message);
    }).finally(() => {
      /* 关闭加载效果 */
      load.loaded();
    });

  } catch (e) {
    console.log(e)
    load.toast(e);
  }
}

/* 监听 */
watch(() => customer.value, () => {
  if (customer.value) {
    loadLabel();
  }
});
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
    padding: 6px 0 0;
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
    padding: 0 10px;
    height: 36px;
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
    border: 1px $primary-color solid;
    margin: 20px 20% 15px;
    width: 60%;
  }

}


.skeleton {
  padding: 30px 5px;
  --van-skeleton-paragraph-background: #e3e3e3;
}

</style>