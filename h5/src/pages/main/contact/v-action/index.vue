<template>
  <van-action-sheet
      v-model:show="visible"
      :actions="actions"
      close-on-click-action
      @select="onSelect">
    <template #cancel>
      <span style="color: red;">取消</span>
    </template>

  </van-action-sheet>
</template>

<script setup>
import {ref, watch} from "vue";
import {injects} from "@/common";
import load from "@/common/load";

/* 客户展示 */
const visible = ref(false);

/* 状态 */
const {
  select_action: customer,
  showDetail
} = injects([
  "select_action",
  "showDetail"
]);

/* 操作 */
const actions = [
  {name: '客户资料'},
  {name: '发送短信'},
  {name: '跟进记录'},
  {name: '通话记录'},
  {name: '客户日志'}
];


/* 功能面板 */
const onSelect = (action) => {
  if (action.name === '客户资料') {
    showDetail(customer.value, 'profile');
  } else if (action.name === '发送短信') {
    sendMessage(customer.value.phone)
  } else if (action.name === '跟进记录') {
    showDetail(customer.value, 'follow');
  } else if (action.name === '通话记录') {
    showDetail(customer.value, 'call');
  } else if (action.name === '客户日志') {
    showDetail(customer.value, 'log');
  }
};


/* 发送短信 */
const sendMessage = (mobile) => {

  if (!/^\d+$/.test(mobile)) {
    load.toast("号码异常");
    return;
  }

  /* 消息对象 */
  const msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);

  msg.to = [mobile];
  plus.messaging.sendMessage(msg);
};


/* 监听 */
watch(() => customer.value, () => {
  if (customer.value) {
    visible.value = true;
  }
});
</script>

<style lang="scss" scoped>

</style>
