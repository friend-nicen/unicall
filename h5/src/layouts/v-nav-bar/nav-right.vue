<template>
  <div class="flex-space">
    <van-popover v-model:show="showPopover" placement="bottom-end" @select="onSelect" :actions="actions">
      <template #reference>
        <van-icon class-prefix="icon" name="caidan_2"></van-icon>
      </template>
    </van-popover>
  </div>
</template>

<script setup>
import {ref} from "vue";
import open_set from "@/common/html5plus/open_set";
import load from "@/common/usual/load";
import {deletAudios} from "@/common/html5plus/monitor";

const showPopover = ref(false);

const actions = [
  {text: '权限设置', icon: 'setting-o'},
  {text: '录音清理', icon: 'delete-o'},
  {text: '退出应用', icon: 'revoke'},
];

/*
* 功能面板
* */
const onSelect = (action) => {

  if (action.text == '权限设置') {
    open_set();
  } else if (action.text == '退出应用') {
    load.confirm("确定退出应用？", () => {
      plus.runtime.quit();
    })
  } else if (action.text == '录音清理') {
    load.confirm("确定清理所有录音文件？", () => {
      deletAudios();
    })
  }

};


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
    color: $text-color;
  }
}

</style>