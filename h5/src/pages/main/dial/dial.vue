<template>

  <div v-if="loaded" class="pannel">

    <!-- 筛选条件 -->
    <v-condition/>

    <ul v-if="data.length > 0" class="customers">

      <template v-for="(item,index) of data" :key="index">
        <li class="item">
          <div class="step1">

            <div class="left">
              <img :src="`${api.avatar}${item.name}`" alt="头像" class="avatar">
              <span class="name">{{ item.name }}</span>
            </div>

            <v-tag :color="item.status">
              {{ item.status ? '已接通' : "未接听" }}
            </v-tag>

          </div>


          <div class="step2">

            <div class="left">
              <div class="mobile">
                手机号：{{ !item.phone ? "无" : item.phone }}
              </div>
              <div class="name">
                归属地：{{ !item.place ? "未知" : item.place }}
              </div>
              <div class="name">
                呼出时间：{{ !item.call_time ? "无" : item.call_time }}
              </div>
            </div>

            <div class="all">
              <div :class="{dialed:item.dial > 0}" class="right" @click.stop="call(item)">
                <van-icon name="phone-o"/>
              </div>
            </div>


          </div>


          <!-- 音频播放器 -->
          <div v-if="item.audio" class="audio-player">
            <div class="player-controls">
              <div class="play-btn" @click.stop="togglePlay(item, index)">
                <van-icon :name="isPlaying(index) ? 'pause-circle-o' : 'play-circle-o'"/>
              </div>
              <div class="progress-bar">
                <div class="progress" :style="{width: getProgress(index) + '%'}"></div>
              </div>
              <div class="time-remaining">
                {{ isPlaying(index) ? formatTime(getRemainingTime(index)) : formatTime(item.duration) }}
              </div>
            </div>
          </div>


        </li>
      </template>

      <!--   加载状态   -->
      <v-load/>
    </ul>

    <van-empty v-else description="暂无数据">
      <van-button class="bottom-button" plain round size="small" type="primary" @click.stop="loadData">重新加载
      </van-button>
    </van-empty>
  </div>

  <div v-else class="skeleton">
    <van-skeleton :row="20" title/>
  </div>

</template>

<script setup>
import init from './dial'
import VCondition from "./v-condition";
import VLoad from "./v-load";
import api from '@/service/api'
import init_comuni from "./comunicate";
import init_audio from './audio';

const {
  loaded,
  loadData,
  data
} = init();


const {
  call
} = init_comuni(loadData);

const {
  togglePlay,
  isPlaying,
  getProgress,
  getRemainingTime,
  formatTime
} = init_audio();

</script>

<style lang="scss" scoped>

.pannel {

  /* 限制fixed */
  transform: scale(1.0);

  .customers {

    list-style: none;
    padding: 8px 10px 16px;


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

        .status {
          background-color: rgba($primary-color, 0.1);
          color: $primary-color;
          border-radius: 3px;

          border: 1px $primary-color solid;
          font-size: $font-size-8;

          padding: 1.5px 5px 1px;
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


        .all {
          @include flex-center;
          flex-direction: column;

          .time {
            margin-bottom: 15px;
            color: $text-color;
            font-size: $font-size-5;
          }

          .right {
            @include flex-center;
            align-items: center;
            color: white;
            padding: 5px;
            flex-shrink: 0;
            border-radius: 50%;
            background-color: $primary-color;

            .van-icon {
              font-size: $font-size-2;
            }
          }


          .dialed {
            background-color: #f1f1f1;
            color: $sub-text-color;
          }

        }


      }


      /* 音频播放器样式 */
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

            .van-icon {
              font-size: $font-size-1;
            }
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
  padding: 30px 5px;
  --van-skeleton-paragraph-background: #e3e3e3;
}

:deep(.bottom-button) {
  padding: 10px 30px;
  background-color: rgba($primary-color, 0.1);
  color: $primary-color;
  border: 1px $primary-color solid;
}

</style>