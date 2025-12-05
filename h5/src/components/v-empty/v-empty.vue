<template>
  <view class="empty">
    <img class="image" src="./v-empty.svg"/>
    <text class="info">{{ desc }}</text>
  </view>
</template>

<script setup>
defineProps({
  height: {
    default: "300px",
    required: false
  },
  desc: {
    required: false,
    default: "暂无数据"
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
    height: 100px;
    max-width: 25vw;
  }

  .info {
    color: #8a8d93;
    font-size: $font-size-4;
  }
}
</style>