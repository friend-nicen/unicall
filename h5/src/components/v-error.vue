<template>
  <div class="error">
    <!-- 网络错误 -->
    <van-empty image="network" description="加载失败">
      <van-button round type="danger" @click="$router.back()">返回上一页</van-button>
    </van-empty>
  </div>
</template>


<style lang="scss" scoped>
.error {
  @include flex-center;
  justify-content: center;
}
</style>
