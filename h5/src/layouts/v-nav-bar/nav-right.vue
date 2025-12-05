<template>
  <div class="flex-space">
    <van-popover v-model:show="visible" :actions="actions" placement="bottom-end" @select="onSelect">
      <template #reference>
        <van-icon class-prefix="icon" name="caidan_2"></van-icon>
      </template>
    </van-popover>
  </div>

  <!-- 更新器-->
  <v-update ref="update"/>

</template>

<script setup>
/* eslint-disable */
import {ref} from "vue";
import load from "@/common/load";
import invoke from "@/utils/bridge";
import VUpdate from './v-update.vue';
import api from "@/service/api";
import axios from "axios";
import quitSystem from "@/service/quit-system";
import {getRecordPath} from "@/plus/monitor";

/* 可见 */
const visible = ref(false);
const update = ref(null);

/* 功能 */
const actions = [
  {text: '权限设置', icon: 'setting-o'},
  {text: '更新应用', icon: 'upgrade'},
  {text: '设备信息', icon: 'description-o'},
  {text: '退出登录', icon: 'revoke'},
  {text: '关闭应用', icon: 'cross'},
];

/* 功能面板 */
const onSelect = (action) => {
  if (action.text === '权限设置') {
    invoke({
      action: "openSet"
    }).catch(e => {
      load.toast(e.message);
    })
  } else if (action.text === '设备信息') {
    load.info(`<div style="padding: 10px;font-size: 14px;">
<div>${plus.device.vendor.toLowerCase()}</div>
<div>${getRecordPath()}</div>
</div>`, null, {
      title: "设备信息"
    });
  } else if (action.text === '关闭应用') {
    load.confirm("确定退出应用？", () => plus.runtime.quit());
  } else if (action.text === '退出登录') {
    quitSystem();
  } else if (action.text === '更新应用') {
    updateApp();
  }
};


/* 更新应用 */
const updateApp = () => {
  try {
    /* 开始请求 */
    axios.post(api.update, {
      version: plus.runtime.version
    })
        .then((res) => {
          /* 判断请求结果 */
          if (res.data.code) {
            load.confirm('检测到最新版，是否更新？', () => {
              update.value.downloadAndInstallApk(res.data.data);
            });
          } else {
            /* 弹出错误原因 */
            load.toast(res.data.errMsg);
          }
        }).catch((e) => {
      /* 弹出错误原因 */
      load.error(e.message);
    }).finally(() => {
      /* 关闭加载效果 */
      load.loaded();
    });
  } catch (e) {
    console.log(e)
    load.error(e);
  }

}
</script>

<style lang="scss" scoped>

.flex-space {

  @include flex-center;
  gap: 20px;
  padding-right: 8px;

  :deep(.van-popover__wrapper) {
    @include flex-center;
  }

  :deep(.icon) {
    font-size: 15px;
    color: $text-color;
  }
}

</style>