<template>
  <template v-if="loaded">

    <template v-if="items.length > 0">
      <van-list
          :finished="finished"
          :loading="loading"
          class="log-list"
          finished-text="没有更多了"
          @load="loadMore"
      >
        <div v-for="it in items" :key="it.id" class="log-item">
          <div class="content">{{ it.info }}</div>
          <div class="time">{{ it.c_time }}</div>
        </div>
      </van-list>
    </template>
    <template v-else>
      <v-empty desc="暂无跟进记录"/>
    </template>

  </template>
  <div v-else class="skeleton">
    <van-loading size="24px"></van-loading>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {injects, store} from "@/common";
import api from "@/service/api";
import load from "@/common/load";
import axios from "axios";

/* 注入 */
const {
  select_detail: customer,
} = injects([
  'select_detail'
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
  axios.post(api.detail.logs, {
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
onMounted(() => loadMore());

</script>

<style lang="scss" scoped>

.log-list {
  padding: 12px 10px 16px;

  .log-item {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background-color: #ffffff;
    border-radius: 12px;
    margin-bottom: 10px;
    padding: 24px 27px;
    border: 1px solid #f0f0f0;

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

</style>