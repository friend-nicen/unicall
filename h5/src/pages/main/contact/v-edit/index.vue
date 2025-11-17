<template>

  <van-popup
      v-model:show="visible"
      :style="{ height: '50%' }"
      class="self-popup"
      closeable
      position="bottom"
      round
      @closed="customer = null">

    <div v-if="detail" class="detail-box">
      <div class="title">{{ detail.name }}</div>
      <div ref="container" class="detail">
        <van-cell-group inset>
          <van-field :modelValue='status[detail.status]' :readonly="true" label="客户状态" right-icon="arrow"
                     @click="select('status')"/>
          <van-field :modelValue='intent[detail.intent]?.label' :readonly="true" label="客户意向" right-icon="arrow"
                     @click="select('intent')"/>
          <van-field v-model="detail.remark" autosize label="备注" type="textarea"/>
        </van-cell-group>
      </div>

      <van-button class="bottom-button" plain round size="small" type="primary" @click="modify">修改信息</van-button>

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
import {computed, ref, watch} from "vue";
import api from "@/service/api";
import load from "@/common/load";
import axios from "axios";
import {injects, switchForm} from "@/common";

/* 事件 */
const visible = ref(false);
const show = ref(false);
const key = ref('status');


/* 状态 */
const {
  select_edit: customer,
  status,
  intent
} = injects([
  "select_edit",
  "status",
  "intent"
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

/* 数据 */
const detail = ref({});


/* 选择 */
const onSelect = (item) => {
  detail.value[key.value] = item.value;
}

/* select  */
const select = (i) => {
  key.value = i;
  show.value = true;
}

/* 修改 */
const modify = () => {

  /* 显示加载效果 */
  load.loading("加载中...");

  try {
    /* 开始请求 */
    axios.post(api.custs.modify, switchForm({
      id: customer.value.id,
      status: detail.value.status,
      intent: detail.value.intent,
      remark: detail.value.remark,
    })).then((res) => {
      /* 判断请求结果 */
      if (res.data.code) {
        /* 关闭显示 */
        visible.value = false;
        /* 同步修改 */
        Object.assign(customer.value, {
          status: detail.value.status,
          intent: detail.value.intent,
          remark: detail.value.remark,
        });
        load.toast("修改成功");
      } else {
        /* 弹出错误原因 */
        load.toast(res.errMsg);
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
/**
 * 加载所有标签
 */
const loadDetail = () => {
  try {
    load.loading('加载中...');
    /* 开始请求 */
    axios.get(`${api.custs.detail}?id=${customer.value.id}`)
        .then((res) => {
          if (res.data.code) {
            detail.value = res.data.data;
            visible.value = true;
          } else {
            load.toast(res.data.errMsg);
          }
        }).catch((e) => {
      load.toast(e.message);
    }).finally(() => {
      load.loaded(0, true);
    });
  } catch (e) {
    console.log(e)
    load.toast(e);
  }
}

/* 监听 */
watch(() => customer.value, () => {
  if (customer.value) {
    loadDetail();
  }
});
</script>

<style lang="scss" scoped>


.detail-box {
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


  .detail {
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
  }

}


.skeleton {
  padding: 30px 5px;
  --van-skeleton-paragraph-background: #e3e3e3;
}

</style>