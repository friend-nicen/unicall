<template>
  <div v-if="loaded" class="task-page">

    <van-pull-refresh
        v-model="refreshing"
        :animation-duration="300"
        class="refreshing"
        @refresh="refresh">

      <template v-if="tasks.length > 0">
        <van-list
            v-model:loading="loading"
            :finished="finish"
            class="task-list"
            finished-text="没有更多了"
            @load="loadData"
        >
          <template v-for="it in tasks" :key="it.id">
            <div class="task-item" @click="openRecords(it)">
              <div class="card-header">
                <div class="title">{{ it.name }}</div>
                <van-icon class="del" name="cross" @click.stop="removeTask(it.id)"/>
              </div>

              <div class="metric-row">
                <div class="metric-col">
                  <div class="label">接通率</div>
                  <div class="num">{{ getConnectRate(it) }}%</div>
                  <div class="desc">已接通 {{ it.pick || 0 }}</div>
                </div>
                <div class="metric-col">
                  <div class="label">任务进度</div>
                  <div class="num">{{ getProgress(it) }}%</div>
                  <div class="desc">剩余 {{ Math.max((it.total || 0) - (it.index || 0), 0) }}</div>
                </div>
                <div class="metric-col">
                  <div class="label">客户数</div>
                  <div class="num">{{ it.total || 0 }}</div>
                  <div class="desc">间隔 {{ it.interval }}s</div>
                </div>
              </div>

              <div class="actions" @click.stop>
                <van-button class="sm-btn" plain round size="small" type="primary" @click="formRef.open(it)">修改任务
                </van-button>
                <van-button class="sm-btn" round size="small" type="primary" @click="runTask(it)">运行任务
                </van-button>

              </div>
            </div>
          </template>
        </van-list>
      </template>
      <template v-else>
        <van-empty description="暂无任务">
          <van-button class="bottom-button" plain round size="small" type="primary" @click.stop="loadData">
            重新加载
          </van-button>
        </van-empty>
      </template>
    </van-pull-refresh>

    <!-- 新增跟进记录 -->
    <div class="create" @click="formRef.open()">
      <van-icon color="#ffffff" name="plus"/>
    </div>

  </div>
  <div v-else class="skeleton">
    <van-loading size="24px"></van-loading>
  </div>


  <VCreate ref="formRef"/>

  <VRecords/>

  <VRun/>

</template>

<script setup>
import {reactive, ref} from 'vue'
import {cut, provides} from '@/common'
import VCreate from './v-create'
import VRecords from './v-records.vue'
import VRun from './v-run.vue'
import initList from './list'
import init_height from "./height";
import load from "@/common/load";

const {
  loaded,
  loadData,
  data: tasks,
  loading,
  refreshing,
  refresh,
  removeTask,
  finish
} = initList()


const visible = reactive({
  create: false,
  record: false,
  run: false
})

/* 表单 */
const formRef = ref(null);
const height = init_height();
const activeTask = ref(null)


/**
 * 打开通话记录界面
 * @param it
 */
const openRecords = (it) => {
  activeTask.value = it;
}

/**
 * 通话进度
 * @param it
 * @return {number|number|number}
 */
const getProgress = (it) => {
  if (!it || !it.total) return 0
  const p = cut((it.index / it.total) * 100, 2)
  return p > 100 ? 100 : p
}


/**
 * 接通率
 * @param it
 * @return {number|number|number}
 */
const getConnectRate = (it) => {
  if (!it || !it.total) return 0
  const r = cut(((it.pick || 0) / it.total) * 100)
  return r > 100 ? 100 : r;
}

/* 筛选导入逻辑由子组件处理 */
const runningTask = ref(null)

/* 运行任务 */
const runTask = (it) => {
  if (it.index >= it.total) {
    load.toast('任务已结束');
    return;
  }
  runningTask.value = it;
  visible.run = true;
}


provides({
  tasks,
  activeTask,
  runningTask,
  visible
})


</script>

<style lang="scss" scoped>
.task-page {
  padding: 12px 10px 15px;

  :deep(.van-pull-refresh) {
    overflow: visible;
  }


  .task-list {
    display: flex;
    flex-direction: column;
    list-style: none;
    min-height: v-bind(height);
    padding: 0;
    gap: 12px;
  }

  .task-item {
    background-color: #fff;
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    padding: 20px 30px;

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;

      .title {
        font-weight: bold;
        font-size: $font-size-2;
        color: $text-color;
        margin-left: 2px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .sub {
        margin-left: auto;
        font-size: $font-size-5;
        color: $text-color-sub;
        padding-right: 24px;
      }

      .del {
        font-size: 18px;
        color: #c8c9cc;
      }
    }

    .metric-row {
      display: flex;
      margin-top: 20px;

      .metric-col {
        flex: 1;
        padding: 6px;
        @include flex-center;
        align-items: flex-start;
        flex-direction: column;
        gap: 2px;

        .label {
          font-size: $font-size-6;
          color: $sm-color;
        }

        .num {
          font-size: $font-size-1;
          font-weight: bold;
          color: $text-color;
          padding: 4px 0;
        }

        .desc {
          font-size: $font-size-6;
          color: $sm-color;
        }
      }
    }

    .actions {
      margin-top: 12px;
      display: flex;
      justify-content: space-between;

      .sm-btn {
        height: 35px;
        width: 45%;
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


.create {
  @include flex-center;
  background-color: $primary-color;
  box-shadow: 1px 1px 15px rgba(#000000, 0.25);
  position: fixed;
  border-radius: 50%;
  right: 15px;
  bottom: 90px;
  width: 45px;
  height: 45px;
  font-weight: bold;
  font-size: 24px;
}
</style>
