<template>
  <div :style="{height:height}" class="place">
  </div>
  <div :style="{height:height}" class="status">
  </div>
</template>
<script setup name="Place">
/* 获取状态栏高度 */
const height = plus.navigator.getStatusbarHeight() + 'px';
</script>
<style scoped>
.place {
  width: 100vw;
  padding: 0;
  margin: 0;
  top: 0;
  left: 0;
}

.status {
  width: 100vw;
  position: fixed;
  padding: 0;
  margin: 0;
  top: 0;
  left: 0;
  z-index: 1000;
}
</style>