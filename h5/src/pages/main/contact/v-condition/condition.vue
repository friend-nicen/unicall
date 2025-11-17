<template>

  <div class="tabbar">
    <van-tabs v-model:active="condition.data.status" :color="$theme['primary-color']" class="tab-top" shrink>
      <van-tab :name="-1" title="全部"></van-tab>
      <template v-for="(i,k) of status" :key="k">
        <van-tab :name="k" :title="i"/>
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
const {
  condition,
  visible_filter,
  status
} = injects([
  'condition',
  'status',
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

  .filter {
    position: absolute;
    right: 0;
    top: 0;
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