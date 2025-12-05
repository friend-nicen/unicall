<template>
  <van-nav-bar>
    <template #left>
      <span v-html="settings.title"></span>
    </template>
    <template #right>
       <span :class="ws.online ? 'online' : 'offline'" class="ws-status" @click="onToggleWs">
        <i class="dot"></i>
        {{ ws.online ? '在线' : '离线' }}
      </span>
      <NavRight/>
    </template>
  </van-nav-bar>
</template>

<script setup>
/* eslint-disable */
/* 引入状态与右侧组件 */
import setting from "@/stores/setting";
import NavRight from "./nav-right.vue";
/* 引入 ws 状态与控制方法 */
import ws from "@/stores/ws";
import {toggleWs} from "@/utils/socket";
/* 读取设置状态 */
const settings = setting();
/* 读取 ws 状态 */
const onToggleWs = () => toggleWs();
/* 组件属性定义 */
defineProps({
  size: {
    type: String,
    default: '15px'
  }
});
</script>

<style scoped>
/* 在线状态样式 */
.ws-status {
  /* 容器整体样式 */
  margin-right: 20px;
  font-size: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  border-radius: 12px;
  padding: 0 8px;
}

/* 状态色：在线绿色，离线红色 */
.ws-status.online {
  color: #52c41a;
  background-color: rgba(82, 196, 26, 0.08);
}

.ws-status.offline {
  color: #ff4d4f;
  background-color: rgba(255, 77, 79, 0.08);
}

/* 前置圆点标记 */
.ws-status .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  background-color: currentColor;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.03);
}

/* 悬浮态微调 */
.ws-status:hover {
  filter: brightness(0.95);
}
</style>
