<template>

  <van-popup
      v-model:show="visible"
      :style="{ height: '70%' }"
      class="self-popup"
      closeable
      position="bottom"
      round
      @closed="customer = null">

    <div v-if="detail" class="detail-box">
      <div class="title">{{ detail.name }}</div>
      <div ref="container" class="detail">
        <van-cell-group inset>
          <van-field v-model="detail.name" :readonly="true" label="姓名"/>
          <van-field v-model="detail.phone" :readonly="true" label="手机号"/>
          <van-field v-model="detail.previous" :readonly="true" label="上次联系"/>
          <van-field :modelValue="detail.count+'次'" :readonly="true" label="通话次数"/>
          <van-field :modelValue="detail.duration+'秒'" :readonly="true" label="通话时长"/>
          <van-field :modelValue='status[detail.status]' :readonly="true" label="客户状态"/>
          <van-field :modelValue='intent[detail.intent]?.label' :readonly="true" label="客户意向"/>
          <van-field :modelValue="detail.remark" :readonly="true" autosize label="备注" type="textarea"/>
          <van-field v-model="detail.assign_time" :readonly="true" label="分配日期"/>
          <van-field v-model="detail.create_time" :readonly="true" label="导入日期"/>
        </van-cell-group>
      </div>
    </div>

  </van-popup>

</template>

<script setup>
import {ref, watch} from "vue";
import api from "@/service/api";
import load from "@/common/load";
import axios from "axios";
import {injects} from "@/common";

/* 事件 */
const visible = ref(false);

/* 状态 */
const {
  select_detail: customer,
  status,
  intent
} = injects([
  "select_detail",
  "status",
  "intent"
]);

/* 数据 */
const detail = ref({});


/**
 * 加载所有标签
 */
const loadDetail = () => {
  try {
    load.loading('加载中...');
    /* 开始请求 */
    axios.get(`${api.custs.detail}?id=${customer.value.id}`)
        .then((res) => {
          if (res.data.code) {
            detail.value = res.data.data;
            visible.value = true;
          } else {
            load.toast(res.data.errMsg);
          }
        }).catch((e) => {
      load.toast(e.message);
    }).finally(() => {
      load.loaded(0, true);
    });
  } catch (e) {
    console.log(e)
    load.toast(e);
  }
}

/* 监听 */
watch(() => customer.value, () => {
  if (customer.value) {
    loadDetail();
  }
});
</script>

<style lang="scss" scoped>


.detail-box {
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;

  .title {
    width: 100%;
    flex-shrink: 0;
    @include flex-center;
    color: $sm-color;
    font-size: $font-size-1;
    padding: 6px 0 12px;
  }


  .detail {
    margin: 0;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 0 15px 0;

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