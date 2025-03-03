<template>
  <view class="empty">
    <image class="image" src="./empty.svg" mode="widthFix"></image>
    <text class="info">暂无数据</text>
  </view>
</template>

<script setup>
defineProps({
  height: {
    default: "60vh",
    required: false
  }
})
</script>

<style lang="scss" scoped>
.empty {
  @include flex-center;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: v-bind(height);
  padding: 0;
  margin: 0;

  .image {
    max-width: 25vw;
  }

  .info {
    color: #8a8d93;
    font-size: $font-size-4;
  }
}
</style>