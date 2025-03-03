<template>
  <div class="flex-space">
    <van-popover v-model:show="showPopover" placement="bottom-end" :actions="actions">
      <template #reference>
        <van-icon class-prefix="icon" name="caidan_2"></van-icon>
      </template>
    </van-popover>
  </div>
</template>

<script setup>
import {ref} from "vue";

const showPopover = ref(false);
const actions = [
  {text: '退出系统', icon: 'add-o'},
  {text: '设置参数', icon: 'music-o'},
  {text: '加油加油', icon: 'more-o'},
];
</script>

<style lang="scss" scoped>
.flex-space {

  @include flex-center;
  gap: 20px;
  margin-right: 6px;

  :deep(.van-popover__wrapper) {
    @include flex-center;
  }

  :deep(.icon) {
    font-size: 15px;
    color: white;
  }
}

</style>