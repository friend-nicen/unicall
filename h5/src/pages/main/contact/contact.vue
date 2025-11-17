<template>

  <div v-if="loaded" class="panel">

    <!-- 筛选条件 -->
    <v-condition/>

    <!-- 客户列表数据 -->
    <div v-if="data.length > 0" class="customer-list">
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
              <span class="detail-value">{{ intent[item.intent].label || '未评估' }}</span>
            </div>

            <div v-if="item.remark" class="detail-item">
              <span class="detail-label">备注</span>
              <span class="detail-value">{{ item.remark }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">上次通话</span>
              <span class="detail-value">{{ item.last_call ? item.last_call : '无记录' }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">分配时间</span>
              <span class="detail-value">{{ item.assign_time ? item.assign_time : '未分配' }}</span>
            </div>


          </div>

          <!-- 操作按钮区域 -->
          <div class="customer-actions">

            <div class="action-btn message-btn" @click.stop="sendMessage(item.phone)">
              <van-icon class="action-icon" name="chat-o"/>
              <span class="action-text">短信</span>
            </div>
            <div class="action-btn tag-btn" @click.stop="showLabel(item)">
              <van-icon class="action-icon" name="label-o"/>
              <span class="action-text">标签</span>
            </div>
            <div class="action-btn wechat-btn" @click.stop="showEdit(item)">
              <van-icon class="action-icon" name="records-o"/>
              <span class="action-text">修改</span>
            </div>
            <div :class="{called: item.dial > 0}" class="action-btn call-btn" @click.stop="call(item)">
              <van-icon class="action-icon" name="phone-o"/>
              <span class="action-text">拨打</span>
            </div>
          </div>
        </div>
      </template>
      <!--   加载状态   -->
      <v-load/>
    </div>

    <van-empty v-else description="暂无数据">
      <van-button class="bottom-button" plain round size="small" type="primary" @click.stop="loadData">重新加载
      </van-button>
    </van-empty>
  </div>

  <div v-else class="skeleton">
    <van-skeleton :row="20" title/>
  </div>

  <!-- 标签选择 -->
  <v-label/>

  <!-- 客户详细信息 -->
  <v-detail/>

  <!-- 客户编辑 -->
  <v-edit/>

  <!-- 条件过滤 -->
  <v-filter v-model:visible="visible_filter"/>

</template>

<script setup>

import init from './contact'
import init_comuni from './comunicate';
import init_label from './label';
import init_detail from './detail';
import init_data from "./data";
import init_Edit from "./edit";
import VCondition from "./v-condition";
import VLabel from "./v-label";
import VDetail from "./v-detail";
import VLoad from "./v-load";
import VFilter from "./v-filter";
import VEdit from "./v-edit";


const {
  call,
  sendMessage
} = init_comuni();


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
  visible_filter
} = init();


const {
  showDetail
} = init_detail();

const {
  showEdit
} = init_Edit();
</script>

<style lang="scss" scoped>

/* MIUI风格的客户列表面板 */
.panel {
  background-color: #f8f9fa;
  /* 限制fixed */
  transform: scale(1.0);

  /* 客户列表容器 */
  .customer-list {
    padding: 8px 10px 16px;

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
          flex: 1;

          .avatar-wrapper {
            margin-right: 12px;

            .customer-avatar {
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background-color: #f0f0f0;
              object-fit: cover;
            }
          }

          .basic-info {
            flex: 1;

            .customer-name {
              font-size: 16px;
              font-weight: 600;
              color: #1a1a1a;
              margin-bottom: 4px;
              line-height: 1.3;
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
        margin-bottom: 16px;
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

      /* 操作按钮区域 */
      .customer-actions {
        display: flex;
        gap: 8px;

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 7px 8px;
          border-radius: 8px;
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
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