<template>

  <div class="tabbar">
    <van-tabs :color="$theme['primary-color']" class="tab-top" v-model:active="condition.data.step">
      <van-tab title="全部客户" :name="0"></van-tab>
      <van-tab title="正在跟进" :name="2"></van-tab>
      <van-tab title="已上门" :name="3"></van-tab>
      <van-tab title="已贷款" :name="4"></van-tab>
    </van-tabs>

    <div class="filter" @click="showFilter">
      <van-icon name="filter-o"/>
    </div>

  </div>

</template>

<script setup>
import {inject} from "vue";

const filter_visible = inject('filter_visible');
const condition = inject('condition');


/* 显示标签 */
const showFilter = () => {
  filter_visible.value = true;
}

</script>

<style lang="scss" scoped>

.tabbar {
  position: sticky;
  left: 0;
  top: 0;
  width: 100%;
  @include flex-center;
  justify-content: space-between;
  background-color: white;
  border-bottom: solid $border-color 1px;

  .filter {
    flex-shrink: 0;
    height: inherit;
    height: 45px;
    @include flex-center;


    &:active {
      .van-icon {
        color: $primary-color;
      }
    }

    .van-icon {
      font-size: 20px;
      padding: 0 18px 0 15px;
      color: $text-color;
    }

  }

  .tab-top {

    width: 100%;

  }
}

</style>