<template>

  <div class="pannel" v-if="loaded">

    <!-- 筛选条件 -->
    <v-condition/>

    <ul class="customers" v-if="data.length > 0">

      <template v-for="(item) of data" :key="item.id">

        <li class="item" @click="showDetail(item)">

          <div class="step1">

            <div class="left">
              <img :src="`${api.avatar}${item.name}`" alt="头像" class="avatar">
              <span class="name">{{ item.name }}</span>
            </div>

            <span class="status">
              {{ ["正在跟进", '已上门', '已贷款'][item.step - 2] }}
            </span>

          </div>


          <div class="step2">

            <div class="left">
              <div class="mobile">
                手机号：{{ !item.mobile ? "无" : item.mobile }}
              </div>
              <div class="name">
                公司名：{{ !item.company ? "无" : item.company }}
              </div>
            </div>

            <div class="right" :class="{dialed:item.dial>0}" @click.stop="dial(item)">
              <van-icon name="phone-o"/>
            </div>

          </div>

          <div class="step3">

            <van-space>
              <div class="button" @click.stop="sendMessage(item.mobile)">
                发送短信
              </div>
              <div class="button" @click.stop="openApp(item.mobile)">
                添加微信
              </div>

              <div class="button" @click.stop="showLabel(item)">
                添加标签
              </div>

              <div class="button" @click.stop="showAction(item)">
                更多操作
              </div>


            </van-space>

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
  <!-- 用于复制 -->
  <span ref="copy_dom" :data-clipboard-text="text" style="width:0;height: 0;"></span>
  <!-- 标签选择 -->
  <v-label v-if="labels.length > 0"/>
  <!-- 客户详细信息 -->
  <v-detail/>
  <!-- 客户详细信息 -->
  <v-edit/>
  <!-- 条件过滤 -->
  <v-filter v-if="labels.length > 0"/>
  <!-- 启动拨号盘 -->
  <van-floating-bubble v-model:offset="offset" @click="showDial=!showDial" :gap="10" axis="xy" icon="phone-o"
                       magnetic="x"/>
  <!-- 拨号盘 -->
  <v-dial v-model:visible="showDial"/>

  <!-- 拨号盘 -->
  <v-follow/>

  <!-- 拨号盘 -->
  <v-add/>


  <!-- 弹出 -->
  <van-action-sheet v-model:show="showPopover" :actions="actions" @select="onActive"/>

</template>

<script setup>

/* eslint-disable */

import init from './contact'
import init_comuni from './comunicate';
import init_label from './label';
import init_detail from './detail';
import init_active from './active';
import init_dial from './dial';
import VCondition from "./v-condition";
import VLabel from "./v-label";
import VDetail from "./v-detail";
import VEdit from "./v-edit";
import VLoad from "./v-load";
import VDial from "./v-dial"
import VFilter from "./v-filter";
import VFollow from './v-follow'
import VAdd from './v-add'


const {
  offset,
  showDial
} = init_dial();


let {
  copy_dom,
  openApp,
  text,
  dial,
  sendMessage
} = init_comuni();

let {
  loaded,
  loadData,
  data,
  api
} = init();


let {showLabel, labels} = init_label();
let {showDetail} = init_detail();


let {
  onActive,
  showAction,
  showPopover,
  active,
  actions
} = init_active(loadData);

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


      .step3 {
        @include flex-center;
        justify-content: flex-start;
        margin-top: 12px;

        .button {
          background-color: #f7f7f7;
          border-radius: 5px;
          color: $sub-text-color;
          font-size: $font-size-6;
          padding: 5px 8px;
          white-space: nowrap;

          &:active {
            color: white;
            background-color: $primary-color;
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