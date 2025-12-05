<template>

  <div class="tabbar">
    <van-tabs v-model:active="condition.data.status" :color="$theme['primary-color']" class="tab-top" shrink>
      <template v-if="summary.data">
        <van-tab :name="-1" :title="`全部(${summary.data[-1]})`"></van-tab>
        <template v-for="(i,k) of status" :key="k">
          <van-tab :name="k" :title="`${i}(${summary.data[k]})`"/>
        </template>
      </template>

    </van-tabs>
    <div class="filter" @click="visible_filter = true">
      <van-icon name="filter-o"/>
    </div>
  </div>

</template>

<script setup>

import {injects} from "@/common";


/* 条件 */
let {
  condition,
  visible_filter,
  status,
  summary
} = injects([
  'condition',
  'status',
  'summary',
  'visible_filter'
]);


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
  z-index: 9999;

  .filter {
    flex-shrink: 0;
    height: 100%;
    background-color: white;
    @include flex-center;


    &:active {
      .van-icon {
        color: $primary-color;
      }
    }

    .van-icon {
      font-size: 22.5px;
      padding: 0 18px 0 15px;
      color: $text-color;
    }

  }

  .tab-top {

    width: 100%;

  }
}

</style>