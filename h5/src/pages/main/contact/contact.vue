<template>

  <div v-if="loaded" class="panel">

    <!-- 筛选条件 -->
    <v-condition/>

    <!-- 客户列表数据 -->
    <van-pull-refresh v-model="refreshing" :animation-duration="300" @refresh="refresh">
      <template v-if="data.length > 0">
        <van-list
            v-model:loading="loading"
            :finished="finish"
            class="customer-list"
            finished-text="没有更多了"
            @load="loadData"
        >
          <template v-for="(item) of data" :key="item.id">
            <div class="customer-card" @click="showDetail(item)">

              <!-- 客户基本信息区域 -->
              <div class="customer-header">
                <div class="customer-info">
                  <div class="avatar-wrapper">
                    <img :src="`${$api.avatar}${item.name}`" alt="头像" class="customer-avatar">
                  </div>
                  <div class="basic-info">
                    <div class="customer-name">{{ item.name }}</div>
                    <div class="customer-phone">{{ !item.phone ? "暂无手机号" : item.phone }}</div>
                  </div>
                </div>
                <v-tag :color="item.status"> {{ status[item.status] || '未知状态' }}</v-tag>
              </div>

              <!-- 客户详细信息区域 -->
              <div class="customer-details">
                <div class="detail-item">
                  <span class="detail-label">意向度</span>
                  <span class="detail-value">{{ intent[item.intent]?.label || '未评估' }}</span>
                </div>

                <div v-if="item.remark" class="detail-item">
                  <span class="detail-label">备注</span>
                  <span class="detail-value">{{ item.remark }}</span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">分配时间</span>
                  <span class="detail-value">{{ item.assign_time ? item.assign_time : '未分配' }}</span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">上次通话</span>
                  <span class="detail-value">{{ item.last_call ? item.last_call : '无记录' }}</span>
                </div>

              </div>

              <!-- 操作按钮区域 -->
              <div class="action">
                <div class="customer-actions">

                  <div class="action-btn tag-btn" @click.stop="showLabel(item)">
                    <van-icon class="action-icon" name="label-o"/>
                    <span class="action-text">标签</span>
                  </div>
                  <div class="action-btn message-btn" @click.stop="showFollow(item)">
                    <van-icon class="action-icon" name="guide-o"/>
                    <span class="action-text">跟进</span>
                  </div>
                  <div class="action-btn wechat-btn" @click.stop="showDetail(item)">
                    <van-icon class="action-icon" name="records-o"/>
                    <span class="action-text">修改</span>
                  </div>
                </div>
                <div class="call-btn" @click.stop="call(item)">
                  <div :class="{called : item.calls > 0}" class="call">
                    <van-icon name="phone-o"/>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </van-list>
      </template>
      <template v-else>
        <van-empty description="暂无数据">
          <van-button class="bottom-button" plain round size="small" type="primary" @click.stop="refresh">重新加载
          </van-button>
        </van-empty>
      </template>
    </van-pull-refresh>
  </div>

  <div v-else class="skeleton">
    <van-loading size="24px"></van-loading>
  </div>

  <!-- 标签选择 -->
  <v-label/>

  <!-- 客户详细信息 -->
  <v-detail ref="detailRef"/>

  <!-- 客户跟进 -->
  <v-follow/>


  <!-- 条件过滤 -->
  <v-filter/>


</template>

<script setup>

import init from './contact'
import init_height from './height';
import init_label from './label';
import init_detail from './detail';
import init_data from "./data";
import init_follow from "./follow";
import VCondition from "./v-condition";
import VLabel from "./v-label";
import VDetail from "./v-detail";
import VFollow from './v-follow';
import VFilter from "./v-filter";


const {
  status,
  intent
} = init_data();

const {
  showLabel
} = init_label();

const {
  loaded,
  loadData,
  data,
  refreshing,
  refresh,
  loading,
  finish,
  call
} = init();


const {
  showDetail,
  detailRef
} = init_detail();

const height = init_height();

/* 跟进记录添加 */
const {
  showFollow
} = init_follow();

</script>

<style lang="scss" scoped>

/* MIUI风格的客户列表面板 */
.panel {
  /* 限制fixed */
  transform: scale(1.0);

  /* 客户列表容器 */
  .customer-list {
    padding: 12px 10px 16px;
    min-height: v-bind(height);

    /* 客户卡片 */
    .customer-card {
      background-color: #ffffff;
      border-radius: 12px;
      margin-bottom: 12px;
      padding: 16px 18px;
      border: 1px solid #f0f0f0;
      transition: all 0.2s ease;

      /* 客户基本信息头部 */
      .customer-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;

        .customer-info {
          display: flex;
          align-items: center;
          width: 100%;
          overflow: hidden;

          .avatar-wrapper {
            flex-shrink: 0;
            width: 42px;
            height: 42px;
            margin-right: 12px;

            .customer-avatar {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              background-color: #f0f0f0;
              object-fit: cover;
            }
          }

          .basic-info {

            width: 100%;
            overflow: hidden;

            .customer-name {
              font-size: 16px;
              font-weight: 600;
              color: #1a1a1a;
              margin-bottom: 4px;
              width: 95%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;

            }

            .customer-phone {
              font-size: 14px;
              color: #666666;
              line-height: 1.3;
            }
          }
        }

      }

      /* 客户详细信息区域 */
      .customer-details {
        margin: 15px 0 10px;
        padding: 0 5px;

        .detail-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;

          &:last-child {
            margin-bottom: 0;
          }

          .detail-label {
            font-size: 13px;
            color: #555555;
            margin-right: 12px;
            white-space: nowrap;
          }

          .detail-value {
            font-size: 13px;
            color: #555555;
            text-align: right;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          /* 意向度等级 */
          .intent-level {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            color: #999999;
          }
        }
      }

      .action {
        display: flex;
        justify-content: space-between;

        gap: 16px;
        /* 操作按钮区域 */
        .customer-actions {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
          overflow: auto;
          @include scroll-bar();
          gap: 12px;

          .action-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px 15px;
            border-radius: 8px;
            height: fit-content;
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            white-space: nowrap;
            width: fit-content;
            gap: 6px;
            cursor: pointer;

            .action-icon {
              font-size: 14px;
            }

            .action-text {
              font-size: 11px;
              font-weight: 500;
              line-height: 1;
            }

          }
        }

        .call-btn {
          @include flex-center;
          justify-content: flex-end;
          margin: 0 5px 0 15px;

          .call {
            @include flex-center;
            align-items: center;
            border: 1px solid #eaeaea;
            border-radius: 50%;
            color: white;
            height: 35px;
            width: 35px;
            background-color: $primary-color;

            .van-icon {
              font-weight: bold;
              transform: rotate(270deg);
              font-size: 18px;
            }
          }

          .called {
            background-color: #f1f1f1;
            color: $sub-text-color;
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


</style>