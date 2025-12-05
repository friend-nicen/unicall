<template>
  <template v-if="loaded">
    <template v-if="items.length > 0">
      <van-list
          v-model:loading="loading"
          :finished="finish"
          finished-text="没有更多了"
          @load="loadMore"
      >
        <ul class="calls">
          <template v-for="(it) of items" :key="it.id">
            <li class="item">

              <div class="step1">
                <div class="left">
                  <span class="name">{{ it.nickname }}</span>
                </div>
                <v-tag :color="it.status">{{ it.status ? '已接通' : '未接听' }}</v-tag>
              </div>

              <div class="step2">
                <div class="left">
                  <div class="name">归属地：{{ it.place || '未知' }}</div>
                  <div class="name">呼出时间：{{ it.call_time || it.start_time || '无' }}</div>
                </div>
              </div>

              <div v-if="it.audio" class="audio-player">
                <div class="player-controls">
                  <div class="play-btn" @click.stop="togglePlay(it)">
                    <van-icon :name="it.playing ? 'pause-circle-o' : 'play-circle-o'"/>
                  </div>
                  <div class="progress-bar">
                    <div :style="{width: getProgress(it) + '%'}" class="progress"></div>
                  </div>
                  <div class="time-remaining">
                    {{ it.playing ? formatTime(getRemainingTime(it)) : formatTime(it.duration || 0) }}
                  </div>
                </div>
              </div>

            </li>
          </template>
        </ul>
      </van-list>
    </template>
    <template v-else>
      <v-empty desc="暂无通话记录"/>
    </template>
  </template>
  <div v-else class="skeleton">
    <van-loading size="24px"></van-loading>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import api from "@/service/api";
import load from "@/common/load";
import {injects, store} from "@/common";
import initAudio from "@/common/audio";

/* 注入 */
const {select_detail: customer} = injects(['select_detail']);

/* 状态 */
const items = ref([]);
const loading = ref(false);

const loaded = ref(false);

/* 分页信息 */
const paginate = store({
  pageSize: 20,
  page: 0,
  last_page: 1,
  total: 0
})

const finished = computed(() => {
  return paginate.data.page === paginate.data.last_page;
});

const finish = finished;

/* 加载数据 */
const loadMore = () => {
  /* 加载数据 */
  if (finished.value) return;
  /* 加载中 */
  loading.value = true;
  /* 页数加1 */
  paginate.data.page++;
  /* 发起请求 */
  axios.post(api.detail.calls, {
    id: customer.value.id,
    pageSize: paginate.data.pageSize,
    page: paginate.data.page
  })
      .then((res) => {

        if (res.data.code) {

          /* 响应数据 */
          const body = res.data.data;

          /* 分页信息 */
          paginate.data.total = body.total;
          paginate.data.last_page = body.last_page;

          /* 续还是重新定义 */
          const list = (body.data || []).map(i => ({...i, playing: false}));
          if (paginate.data.page === 1) {
            items.value = list;
          } else {
            items.value = items.value.concat(list);
          }

          /* 加载完成 */
          if (!loaded.value) loaded.value = true;

        } else {
          load.toast(res.data?.errMsg || '加载失败');
          finished.value = true;
        }
      })
      .catch((e) => {
        load.toast(e.message);
      })
      .finally(() => {
        loading.value = false;
      });
};

/* 音频控制 */
const {
  togglePlay,
  getProgress,
  getRemainingTime,
  formatTime
} = initAudio(items);

/* 初始化 */
onMounted(() => loadMore());


</script>

<style lang="scss" scoped>
.calls {
  list-style: none;
  padding: 0 10px 16px;

  .item {
    background-color: white;
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    margin-top: 12px;
    padding: 20px 20px;

    @mixin space-between {
      @include flex-center;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      overflow: hidden;
    }

    .step1 {
      @include space-between;

      * {
        color: $text-color;
      }

      .left {
        @include flex-center;
        align-items: center;

        .name {
          font-size: $font-size-2;
          font-weight: bold;
        }
      }
    }

    .step2 {
      margin-top: 12px;
      @include space-between;

      .left {
        width: 85%;
        font-size: $font-size-4;

        * {
          color: $sm-color;
        }

        .mobile, .name {
          width: 100%;
          overflow: hidden;
          padding: 5px 0;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }

    .audio-player {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #f5f5f5;

      .player-controls {
        @include flex-center;
        justify-content: space-between;
        align-items: center;

        .play-btn {
          @include flex-center;
          align-items: center;
          color: $primary-color;
        }

        .van-icon {
          font-size: $font-size-1;
        }

        .progress-bar {
          flex: 1;
          height: 4px;
          background-color: #f1f1f1;
          border-radius: 2px;
          margin: 0 10px;
          position: relative;
          overflow: hidden;

          .progress {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background-color: $primary-color;
            border-radius: 2px;
          }
        }

        .time-remaining {
          font-size: $font-size-5;
          color: $sm-color;
          min-width: 40px;
          text-align: right;
        }
      }
    }
  }
}

</style>