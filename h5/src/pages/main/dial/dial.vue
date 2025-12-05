<template>

  <div v-if="loaded" class="pannel">

    <!-- 筛选条件 -->
    <v-condition/>

    <van-pull-refresh v-model="refreshing" :animation-duration="300" @refresh="refresh">
      <template v-if="data.length > 0">
        <van-list
            v-model:loading="loading"
            :finished="finish"
            finished-text="没有更多了"
            @load="loadData"
        >
          <ul v-if="data.length > 0" class="customers">
            <template v-for="(item) of data" :key="item.id">
              <li class="item">
                <div class="step1">

                  <div class="left">
                    <img :src="`${api.avatar}${item.name}`" alt="头像" class="avatar">
                    <span class="name">{{ item.name }}</span>
                    <div v-if="!item.cid" class="add-customer">
                      <van-button class="add-btn" hairline plain round size="mini" type="primary"
                                  @click.stop="addCustomer(item)">
                        <van-icon name="plus"/>
                        添加
                      </van-button>
                    </div>
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
                    <div class="right" @click.stop="call(item)">
                      <van-icon name="phone-o"/>
                    </div>
                  </div>


                </div>


                <!-- 音频播放器 -->
                <div v-if="item.audio" class="audio-player">
                  <div class="player-controls">
                    <div class="play-btn" @click.stop="togglePlay(item)">
                      <van-icon :name="item.playing ? 'pause-circle-o' : 'play-circle-o'"/>
                    </div>
                    <div class="progress-bar">
                      <div :style="{width: getProgress(item) + '%'}" class="progress"></div>
                    </div>
                    <div class="time-remaining">
                      {{ item.playing ? formatTime(getRemainingTime(item)) : formatTime(item.duration) }}
                    </div>
                  </div>
                </div>


              </li>
            </template>
          </ul>
        </van-list>
      </template>
      <template v-else>
        <van-empty description="暂无数据">
          <van-button class="bottom-button" plain round size="small" type="primary" @click.stop="loadData">
            重新加载
          </van-button>
        </van-empty>
      </template>
    </van-pull-refresh>
  </div>

  <div v-else class="skeleton">
    <van-loading size="24px"></van-loading>
  </div>


</template>

<script setup>
import init from './dial'
import VCondition from "./v-condition";
import api from '@/service/api'
import init_comuni from "./comunicate";
import init_audio from '@/common/audio';
import init_height from "./height";
import init_add from "./add";

const {
  loaded,
  loadData,
  data,
  loading,
  refreshing,
  refresh,
  finish
} = init();


const {
  call
} = init_comuni();

const {
  togglePlay,
  getProgress,
  getRemainingTime,
  formatTime
} = init_audio(data);

const height = init_height();

const {addCustomer} = init_add();

</script>

<style lang="scss" scoped>

.pannel {

  /* 限制fixed */
  transform: scale(1.0);

  .customers {

    list-style: none;
    padding: 12px 10px 16px;
    min-height: v-bind(height);

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

          .add-customer {
            margin-left: 8px;

            .add-btn {
              height: 24px;
              padding: 0 10px;
              border-color: #d2d2d2;
              color: $primary-color;
              background: transparent;
              font-size: $font-size-7;
            }

            :deep(.add-btn .van-icon) {
              font-size: 10px;
              margin-right: 4px;
            }
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
            height: 30px;
            width: 30px;
            flex-shrink: 0;
            border-radius: 50%;
            background-color: $primary-color;
            border: 1px solid #eaeaea;

            .van-icon {
              font-weight: bold;
              transform: rotate(270deg);
              font-size: 18px;
            }
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
              font-size: 21px;
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
  @include flex-center;
  align-items: center;
  height: 80%;
}

:deep(.bottom-button) {
  padding: 10px 30px;
  background-color: rgba($primary-color, 0.1);
  color: $primary-color;
  border: 1px $primary-color solid;
}

.fab-keypad {
  position: fixed;
  right: 18px;
  bottom: 86px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: $primary-color;
  color: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  @include flex-center;
}

</style>
