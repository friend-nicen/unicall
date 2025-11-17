<template>
  <div class="flex-space">
    <van-popover v-model:show="visible" :actions="actions" placement="bottom-end" @select="onSelect">
      <template #reference>
        <van-icon class-prefix="icon" name="caidan_2"></van-icon>
      </template>
    </van-popover>
  </div>
</template>

<script setup>
import {ref} from "vue";
import load from "@/common/load";
import invoke from "@/utils/bridge";

const visible = ref(false);

const actions = [
  {text: '权限设置', icon: 'setting-o'},
  {text: '退出应用', icon: 'revoke'},
];

/* 功能面板 */
const onSelect = (action) => {
  if (action.text === '权限设置') {
    invoke({
      action: "openSet"
    }).catch(e => {
      load.toast(e.message);
    })
  } else if (action.text === '退出应用') {
    load.confirm("确定退出应用？", () => plus.runtime.quit());
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