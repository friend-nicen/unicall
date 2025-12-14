<template>
  <van-popup
      v-model:show="visible.record"
      class="record-popup"
      closeable
      position="bottom"
      round
      safe-area-inset-bottom
      title="通话记录"
      @closed="activeTask = null">
    <template v-if="loaded">
      <div class="title">通话记录</div>
      <template v-if="items.length > 0">
        <div class="calls">
          <van-list
              v-model:loading="loading"
              :finished="finish"
              class="customers"
              finished-text="没有更多了"
              @load="loadMore"
          >
            <template v-for="it in items" :key="it.id">
              <div class="item">
                <div class="step1">
                  <div class="left">
                    <img :src="`${api.avatar}${it.name || it.nickname || ''}`" alt="头像" class="avatar"/>
                    <span class="name">{{ it.name || it.nickname || '未知' }}</span>
                  </div>
                  <v-tag :color="it.status">{{ it.status ? '已接通' : '未接听' }}</v-tag>
                </div>

                <div class="step2">
                  <div class="left">
                    <div class="mobile">手机号：{{ it.phone || it.mobile || '无' }}</div>
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
                      <div :style="{ width: getProgress(it) + '%' }" class="progress"></div>
                    </div>
                    <div class="time-remaining">
                      {{ it.playing ? formatTime(getRemainingTime(it)) : formatTime(it.duration || 0) }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </van-list>
        </div>
      </template>
      <template v-else>
        <v-empty desc="暂无通话记录"/>
      </template>
    </template>
    <div v-else class="skeleton">
      <van-loading size="24px"/>
    </div>
  </van-popup>
</template>

<script setup>
import api from '@/service/api'
import request from '@/common/request'
import {injects} from '@/common'
import initAudio from '@/common/audio'
import {watch} from "vue";

const {
  visible,
  activeTask
} = injects([
  'visible',
  'activeTask'
])

const {
  data: items,
  loading,
  loaded,
  finish,
  paginate,
  loadData: loadMore
} = request({
  url: () => api.custs.calls,
  data: () => ({task: activeTask.value?.id}),
  before: () => !!activeTask.value?.id,
  complete: () => {
    items.value = (items.value || []).map(i => ({...i, playing: i.playing ?? false}))
  }
})

const {
  togglePlay,
  getProgress,
  getRemainingTime,
  formatTime
} = initAudio(items)

watch(() => activeTask.value, () => {
  if (activeTask.value) {
    paginate.reset();
    loadMore()
        .then(() => {
          visible.record = true;
        })
  }
})
</script>

<style lang="scss" scoped>
.record-popup {
  height: 60vh;
  background-color: #f7f7f7 !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;


  .title {
    padding: 15px;
    text-align: center;
    background-color: #ffffff;
    width: 100%;
    font-size: 15px;
    top: 0;
    left: 0;
  }
}

.calls {
  height: 100%;
  overflow: auto;

  .customers {
    list-style: none;
    padding: 12px 10px 16px;

    .item {
      background-color: white;
      border-radius: 12px;
      border: 1px solid #f0f0f0;
      margin-bottom: 12px;
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

          .avatar {
            width: 24px;
            height: 24px;
            border-radius: 50%;
          }

          .name {
            font-size: $font-size-1;
            font-weight: bold;
            margin-left: 12px;
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
}

.skeleton {
  @include flex-center;
  align-items: center;
  height: 80%;
}
</style>
