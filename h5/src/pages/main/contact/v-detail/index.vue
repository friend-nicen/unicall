<template>

  <van-popup
      v-model:show="visible"
      :destroy-on-close="true"
      :style="{ height: '80%' }"
      class="popup-detail"
      closeable
      position="bottom"
      safe-area-inset-bottom
      round
      @closed="customer = null">

    <div class="detail-box">

      <div class="tabs">
        <van-tabs v-model:active="active" shrink>
          <van-tab name="profile" title="客户资料"/>
          <van-tab name="call" title="通话记录"/>
          <van-tab name="follow" title="跟进记录"/>
          <van-tab name="log" title="客户日志"/>
        </van-tabs>
      </div>

      <div class="tab-content">
        <div class="layout">
          <keep-alive>
            <template v-if="active === 'profile'">
              <profile/>
            </template>
            <template v-else-if="active === 'call'">
              <dial/>
            </template>
            <template v-else-if="active === 'follow'">
              <follow/>
            </template>
            <template v-else-if="active === 'log'">
              <log/>
            </template>
          </keep-alive>
        </div>
      </div>
    </div>

  </van-popup>

</template>

<script setup>
import {ref} from "vue";
import {injects} from "@/common";
import Profile from "./profile.vue";
import Dial from "./dial.vue";
import Follow from "./follow.vue";
import Log from "./log.vue";

/* 展示 */
const visible = ref(false);
const active = ref("profile");

const {
  select_detail: customer
} = injects([
  "select_detail"
]);

defineExpose({
  show(tab) {
    active.value = tab;
    visible.value = true;
  }
})

</script>

<style lang="scss" scoped>
.detail-box {
  display: flex;
  flex-direction: column;
  padding: 0;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;

  .tabs {
    background-color: #ffffff;
    width: 100%;
    padding: 6px;
  }

  .tab-content {
    height: 100%;
    padding: 0;
    overflow-y: auto;
    background-color: #f7f7f7 !important;

    .layout {
      height: 100%;
      overflow-y: auto;
      padding: 0;
    }
  }

  :deep(.skeleton ) {
    @include flex-center;
    align-items: center;
    height: 80%;
  }

}
</style>
