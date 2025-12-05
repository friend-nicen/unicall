<template>

  <van-popup
      v-model:show="visible"
      :style="{ height: '50%' }"
      class="self-popup"
      closeable
      position="bottom"
      round
      safe-area-inset-bottom
      @closed="customer = null">

    <div class="follow-box">

      <div class="title">{{ customer.name }}</div>

      <div ref="container" class="follow">

        <van-cell-group inset>

          <van-field :modelValue='status[follow.status]'
                     :readonly="true"
                     label="客户状态"
                     right-icon="arrow"
                     @click="select('status')"/>

          <van-field :modelValue='intent[follow.intent]?.label'
                     :readonly="true" label="客户意向"
                     right-icon="arrow"
                     @click="select('intent')"/>

          <van-field v-model="follow.follow" autosize label="跟进记录" placeholder="请输入跟进信息" type="textarea"/>

        </van-cell-group>
      </div>

      <van-button
          class="bottom-button"
          plain round
          size="small"
          type="primary"
          @click="modify">
        新增记录
      </van-button>

    </div>

  </van-popup>

  <van-action-sheet
      v-model:show="show"
      :actions="options"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect">
    <template #cancel>
      <span style="color:red;">{{ "取消" }}</span>
    </template>
  </van-action-sheet>


</template>

<script setup>
import {computed, reactive, ref, watch} from "vue";
import {injects} from "@/common";
import api from "@/service/api";
import load from "@/common/load";
import axios from "axios";

/* 事件 */
const visible = ref(false);
const show = ref(false);
const key = ref('status');

/* 跟进记录 */
const follow = reactive({
  id: null,
  status: null,
  intent: null,
  follow: ""
});


/* 状态 */
const {
  select_follow: customer,
  status,
  intent,
  after_follow
} = injects([
  "select_follow",
  "status",
  "intent",
  'after_follow'
]);


/* options */
const options = computed(() => {
  if (key.value === 'status') {
    return status.value.map((i, k) => {
      return {
        name: i,
        value: k
      }
    })
  } else {
    return intent.value.map((i) => {
      return {
        name: i.label,
        value: i.value
      }
    })
  }
})

/* 选择 */
const onSelect = (item) => {
  follow[key.value] = item.value;
}

/* select  */
const select = (i) => {
  key.value = i;
  show.value = true;
}

/* 修改 */
const modify = () => {
  try {
    /* 开始请求 */
    axios.post(api.detail.follow, follow)
        .then((res) => {
          /* 判断请求结果 */
          if (res.data.code) {

            /* 同步修改客户状态 */
            customer.value.status = follow.status;
            customer.value.intent = follow.intent

            /* 关闭显示 */
            visible.value = false;
            load.toast("添加成功");

            /* 触发回调 */
            if (after_follow.callback) {
              after_follow.callback()
            }

          } else {
            /* 弹出错误原因 */
            load.toast(res.data.errMsg);
          }
        }).catch((e) => {
      /* 弹出错误原因 */
      load.toast(e.message);
    }).finally(() => {
      /* 关闭加载效果 */
      load.loaded();
    });
  } catch (e) {
    console.log(e)
    load.toast(e);
  }
}

/* 监听 */
watch(() => customer.value, () => {
  if (customer.value) {
    follow.id = customer.value.id;
    follow.status = customer.value.status;
    follow.intent = customer.value.intent;
    visible.value = true;
  }
});
</script>

<style lang="scss" scoped>


.follow-box {
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;

  --van-field-icon-size: 14 \px;

  .title {
    width: 100%;
    flex-shrink: 0;
    @include flex-center;
    color: $sm-color;
    font-size: $font-size-1;
    padding: 6px 0 12px;
  }


  .follow {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 15px 0;
    margin: 0 15px;
    border-radius: 12px;
    background-color: #ffffff;
  }

  .bottom-button {
    flex-shrink: 0;
    padding: 0 10px;
    height: 36px;
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
    border: 1px $primary-color solid;
    margin: 20px 20% 15px;
    width: 60%;

    &:active {
      background-color: $primary-color;
      color: white;
    }

  }

}


.skeleton {
  padding: 30px 5px;
  --van-skeleton-paragraph-background: #e3e3e3;
}

</style>