<template>
  <div class="loading" v-if="loading">
    <van-loading size="24px">加载中...</van-loading>
  </div>

  <div class="no-more" v-if="pagination.data.page == pagination.data.last_page">
    没有更多了
  </div>
</template>

<script setup>
import {inject} from "vue";

const loading = inject('loading')
const pagination = inject('pagination')
</script>

<style lang="scss" scoped>
.loading, .no-more {
  @include flex-center;
  padding: 15px;
}

.no-more {
  font-size: $font-size-4;
  color: $text-color-sub;
}
</style>