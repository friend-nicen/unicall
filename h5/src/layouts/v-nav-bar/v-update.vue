<template>
  <!-- 下载进度弹窗 -->
  <van-popup v-model:show="visible" :style="{ width: '80%' }" round teleport="body" @closed="onClosed">
    <div class="download-popup">
      <div class="close-icon" @click="cancelDownload">
        <van-icon name="cross"/>
      </div>
      <div class="download-title">{{ downloadComplete ? '下载完成' : '下载应用' }}</div>
      <div class="progress-container">
        <van-circle
            :color="$theme['primary-color']"
            :current-rate="progress"
            :rate="100"
            :text="progressText"
            size="80px"
        />
      </div>
      <div class="download-status">{{ downloadStatusText }}</div>
      <div class="download-actions">
        <van-button v-if="downloadComplete"
                    :color="$theme['primary-color']"
                    block
                    round
                    type="primary"
                    @click="installApk">去安装
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
/* eslint-disable */
/* 展示弹出框 */
import {computed, ref} from "vue";
import load from "@/common/load";

/* 状态 */
const visible = ref(false);
const progress = ref(0);

/* 文案数据 */
const downloadComplete = ref(false);
const downloadStatusText = ref('准备下载...');
const progressText = computed(() => progress.value.toFixed(0) + '%');


/* 下载任务对象 */
let dtask = null;

/* 下载文件路径 */
let downloadedFilePath = '';

/* 下载缓存对象，key是下载链接，value是文件地址 */
const downloadCache = {};

/**
 * 下载并安装APK
 * @param {String} url APK下载地址
 */
const downloadAndInstallApk = (url) => {

  if (!url) {
    load.toast('下载地址异常');
    console.stack('下载地址异常：' + url);
    return;
  }

  /* 检查缓存中是否已有该下载链接对应的文件 */
  if (downloadCache[url]) {
    /* 已经下载过，直接显示下载完成状态 */
    visible.value = true;
    progress.value = 100;
    downloadComplete.value = true;
    downloadStatusText.value = '下载完成，请点击安装';
    downloadedFilePath = downloadCache[url];
    console.log('使用缓存文件：' + downloadedFilePath);
    return;
  }

  /* 重置状态 */
  downloadComplete.value = false;
  downloadStatusText.value = '准备下载...';

  /* 显示下载进度弹窗 */
  visible.value = true;
  progress.value = 0;

  /* 创建下载任务 */
  dtask = plus.downloader.createDownload(url, {}, (d, status) => {
    /* 下载完成 */
    if (status === 200) {
      /* 更新状态为下载完成 */
      downloadComplete.value = true;
      downloadStatusText.value = '下载完成，请点击安装';
      /* 保存下载文件路径，供后续安装使用 */
      downloadedFilePath = d.filename;
      progress.value = 100;
      /* 将下载链接和文件路径存入缓存 */
      downloadCache[url] = downloadedFilePath;
      console.log('文件已缓存：' + url + ' -> ' + downloadedFilePath);
    } else {
      /* 下载失败 */
      downloadStatusText.value = '下载失败，请重试';
      console.error('下载失败：' + status);
    }
  });

  /* 监听下载进度 */
  dtask.addEventListener('statechanged', (task) => {
    switch (task.state) {
      case 1: /* 开始 */
        downloadStatusText.value = '开始下载...';
        console.log('开始下载...');
        break;
      case 2: /* 已连接到服务器 */
        downloadStatusText.value = '连接到服务器...';
        console.log('连接到服务器...');
        break;
      case 3: /* 已接收到数据 */
        /* 更新下载进度 */
        const totalSize = task.totalSize > 0 ? task.totalSize : 100;
        const percent = parseInt(task.downloadedSize / totalSize * 100);
        progress.value = percent;

        /* 计算下载速度和剩余时间 */
        const downloadedMB = (task.downloadedSize / (1024 * 1024)).toFixed(2);
        const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
        downloadStatusText.value = `已下载 ${downloadedMB}MB / ${totalMB}MB`;
        break;
      case 4: /* 下载完成 */
        console.log('下载完成');
        break;
    }
  });

  /* 开始下载任务 */
  dtask.start();
}

/**
 * 安装APK
 */
const installApk = () => {
  if (downloadedFilePath) {
    plus.runtime.install(downloadedFilePath, {}, () => {
      /* 安装成功 */
      console.log('安装成功');
      /* 安装后关闭弹窗 */
      visible.value = false;
    }, (e) => {
      /* 安装失败 */
      load.toast('安装失败：' + e.message);
      downloadStatusText.value = '安装失败：' + e.message;
    });
  } else {
    downloadStatusText.value = '安装文件不存在';
  }
}

/**
 * 取消下载
 */
const cancelDownload = () => {

  if (dtask && !downloadComplete.value) {
    dtask.abort();
    dtask = null;
  }

  /* 重置状态 */
  visible.value = false;
}


/**
 * 关闭
 */
const onClosed = () => {
  progress.value = 0;
  downloadComplete.value = false;
  downloadStatusText.value = '准备下载...';
}

defineExpose({
  downloadAndInstallApk
});
</script>

<style lang="scss">
/* 下载弹窗样式 */
.download-popup {
  position: relative;
  padding: 20px;

  .close-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    color: #999;
  }

  .download-title {
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    margin-bottom: 20px;
    color: #333;
  }

  .progress-container {
    @include flex-center;
    justify-content: center;
    margin-bottom: 12px;
  }

  .download-status {
    font-size: 13px;
    color: #666;
    text-align: center;
    margin-bottom: 16px;
  }

  .download-actions {
    margin-top: 20px;

    .van-button {
      height: 40px;
      font-size: 14px;
      font-weight: 500;
    }
  }
}
</style>
