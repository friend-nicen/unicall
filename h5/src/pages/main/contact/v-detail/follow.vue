<template>
  <template v-if="loaded">

    <template v-if="items.length > 0">
      <van-list
          :finished="finished"
          :loading="loading"
          class="follow-list"
          finished-text="没有更多了"
          @load="loadMore"
      >
        <div v-for="it in items" :key="it.id" class="follow-item">
          <div class="item-header">
            <span class="uname">{{ it.uname }}</span>
            <div class="meta">
              <v-tag :color="it.status">{{ status[it.status] || '未知状态' }}</v-tag>
              <v-tag :color="it.intent">{{ intent[it.intent]?.label || '未评估' }}</v-tag>
            </div>
          </div>

          <div class="content">{{ it.follow }}</div>
          <span class="time">{{ it.c_time }}</span>
        </div>
      </van-list>
    </template>
    <template v-else>
      <v-empty desc="暂无跟进记录"/>
    </template>

    <!-- 新增跟进记录 -->
    <div class="follow" @click="showFollow(customer)">
      <van-icon color="#ffffff" name="plus"/>
    </div>

  </template>
  <div v-else class="skeleton">
    <van-loading size="24px"></van-loading>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import axios from "axios";
import api from "@/service/api";
import load from "@/common/load";
import {injects, store} from "@/common";


/* 注入 */
const {
  select_detail: customer,
  showFollow,
  status,
  intent,
  after_follow
} = injects([
  'select_detail',
  'showFollow',
  'status',
  'intent',
  'after_follow'
]);

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

/* 加载数据 */
const loadMore = () => {
  /* 加载数据 */
  if (finished.value) return;
  /* 加载中 */
  loading.value = true;
  /* 页数加1 */
  paginate.data.page++;
  /* 发起请求 */
  axios.post(api.detail.follows, {
    id: customer.value.id,
    page: paginate.data.page,
    pageSize: paginate.data.pageSize
  })
      .then((res) => {

        if (res.data.code) {

          /* 响应数据 */
          const body = res.data.data;

          /* 分页信息 */
          paginate.data.total = body.total;
          paginate.data.last_page = body.last_page;

          /* 续还是重新定义 */
          if (paginate.data.page === 1) {
            items.value = body.data; //数据
          } else {
            items.value = items.value.concat(body.data);
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


/* 初始化 */
onMounted(() => {
  loadMore();
  /* 挂载 */
  after_follow.callback = () => {
    paginate.reset();
    loadMore();
  }
});

onUnmounted(() => {
  after_follow.callback = null;
})

</script>

<style lang="scss" scoped>

.follow-list {
  padding: 12px 10px 16px;

  .follow-item {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background-color: #ffffff;
    border-radius: 12px;
    margin-bottom: 10px;
    padding: 24px 27px;
    border: 1px solid #f0f0f0;

    .meta {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .uname {
        font-size: 16px;
        font-weight: 600;
        color: #1a1a1a;
      }
    }


    .time {
      font-size: 12px;
      color: #999999;
    }

    .content {
      font-size: 14px;
      color: #555555;
      line-height: 1.5;
    }
  }

}

.follow {
  @include flex-center;
  background-color: $primary-color;
  box-shadow: 1px 1px 3px rgba($primary-color, 0.5);
  position: fixed;
  border-radius: 50%;
  right: 15px;
  bottom: 30px;
  width: 45px;
  height: 45px;
  font-weight: bold;
  font-size: 24px;
}

</style>