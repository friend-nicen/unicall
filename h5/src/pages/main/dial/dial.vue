<template>

  <div class="pannel" v-if="loaded">

    <!-- 筛选条件 -->
    <v-condition/>

    <ul class="customers" v-if="data.length > 0">

      <template v-for="(item,index) of data" :key="index">
        <li class="item">
          <div class="step1">

            <div class="left">
              <img :src="`${api.avatar}${item.name}`" alt="头像" class="avatar">
              <span class="name">{{ item.name }}</span>
            </div>

            <span class="status">
              {{ item.duration == 0 ? "未接" : '已接通' }}
            </span>

          </div>


          <div class="step2">

            <div class="left">
              <div class="mobile">
                手机号：{{ !item.mobile ? "无" : item.mobile }}
              </div>
              <div class="name">
                归属地：{{ !item.place ? "未知" : item.place }}
              </div>
              <div class="name">
                呼出时间：{{ !item.callTime ? "无" : item.callTime }}
              </div>
            </div>

            <div class="all">
              <span class="time">{{ item.duration }}s</span>
              <div class="right" :class="{dialed:item.dial>0}" @click.stop="dial(item)">
                <van-icon name="phone-o"/>
              </div>
            </div>


          </div>
        </li>
      </template>

      <!--   加载状态   -->
      <v-load/>
    </ul>

    <van-empty v-else description="暂无数据">
      <van-button plain @click.stop="loadData" size="small" round type="primary" class="bottom-button">重新加载
      </van-button>
    </van-empty>
  </div>

  <div v-else class="skeleton">
    <van-skeleton title :row="20"/>
  </div>

</template>

<script setup>
import init from './dial'
import VCondition from "./v-condition";
import VLoad from "./v-load";
import api from '@/service/api'
import init_comuni from "./comunicate";


let {
  loaded,
  loadData,
  data
} = init();


let {
  dial
} = init_comuni(loadData);


</script>

<style lang="scss" scoped>

.pannel {

  /* 限制fixed */
  transform: scale(1.0);

  .customers {

    list-style: none;
    padding: 0;
    margin: 12px 0;

    .item {

      background-color: white;
      border-radius: 8px;
      padding: 15px 15px 12px;
      margin: 12px 15px;

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