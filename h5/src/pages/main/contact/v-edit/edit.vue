<template>

  <van-popup
      v-model:show="edit_visible"
      closeable
      round
      position="bottom"
      class="self-popup"
      :style="{ height: '80%' }"
  >

    <div class="panel-edit" v-if="loaded">

      <!-- 标题 -->
      <div class="title">{{ !select_edit_customer.data ? "" : select_edit_customer.data.name }}</div>

      <div class="edit">

        <van-cell-group inset>
          <!-- 输入任意文本 -->
          <van-field :readonly="readonly" placeholder="请输入姓名" v-model="customer.edit.name" label="姓名"/>
          <!-- 输入手机号，调起手机号键盘 -->
          <van-field :readonly="readonly" placeholder="请输入手机号" v-model="customer.edit.mobile" label="手机号"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="readonly" placeholder="请输入公司名称" v-model="customer.edit.company"
                     label="公司名称"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="readonly" placeholder="请输入税号" v-model="customer.edit.tax" label="税号"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="readonly" placeholder="请输入地区" v-model="customer.edit.area" label="地区"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="readonly" placeholder="请输入行业" v-model="customer.edit.industry" label="行业"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="readonly" placeholder="请输入年开票" v-model="customer.edit.to_year" label="年开票"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="readonly" placeholder="请输入年纳税" v-model="customer.edit.toTax" label="年纳税"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="true" @click="showStar=true" placeholder="请选择客户评级"
                     :modelValue='!customer.edit.star?"暂无":(customer.edit.star+"星")'
                     label="客户评级"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="readonly" placeholder="请输入年销售" v-model="customer.edit.sell_year" label="年销售"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field autosize :readonly="readonly" placeholder="请输入追加备注" rows="5" type="textarea"
                     v-model="customer.edit.add_remarks"
                     label="追加备注"/>

        </van-cell-group>


      </div>

      <van-button plain size="small" round type="primary" @click="modify" class="bottom-button">确认修改</van-button>

    </div>

    <div v-else class="skeleton">
      <van-skeleton title :row="5"/>
    </div>

  </van-popup>

  <van-action-sheet v-model:show="showStar" :actions="stars" @select="onSelectStar"/>

</template>

<script setup>
import {inject, watch, ref, reactive} from "vue";
import api from "@/service/api";
import axios from "axios";
import load from "@/common/usual/load";
import {switchForm} from "@/common/usual/common";
import initShowLevel from './showLevel'

const edit_visible = inject('edit_visible');
const select_edit_customer = inject('select_edit_customer');
const loaded = ref(false); //数据是否已加载
const customer = reactive({edit: null}); //所有标签
const readonly = ref(false); //只读

/*  */
const {
  showStar,
  onSelectStar,
  stars
} = initShowLevel(customer);

/**
 * 加载所有标签
 */
const loadDetail = () => {

  try {
    /* 开始请求 */
    axios.get(api.detail + "?id=" + select_edit_customer.data.id)
        .then((res) => {
          /*
          * 判断请求结果
          * */
          if (res.data.code) {
            customer.edit = res.data.data;
            customer.edit.add_remarks = null;
          } else {
            /* 弹出错误原因 */
            load.error(res.data.errMsg);
          }
        }).catch((e) => {
      /* 弹出错误原因 */
      load.error(e.message);
    }).finally(() => {
      /* 关闭加载效果 */
      load.loaded();
      loaded.value = true;
    });

  } catch (e) {
    console.log(e)
    load.error(e);
  }
}


/*
* 检测
* */
watch(() => edit_visible, () => {
  if (edit_visible.value) {
    loaded.value = false;
    loadDetail(); //加载用户数据
  }
}, {
  deep: true
})


/*
* 修改
* */
const modify = () => {

  load.loading();//加载效果

  try {
    /* 开始请求 */
    axios.post(api.modify + "?id=" + select_edit_customer.data.id, switchForm(customer.edit))
        .then((res) => {
          /*
          * 判断请求结果
          * */
          if (res.data.code) {
            edit_visible.value = false;
            Object.assign(select_edit_customer.data, customer.edit);
            load.success('修改成功！');
          } else {
            /* 弹出错误原因 */
            load.error(res.data.errMsg);
          }
        }).catch((e) => {
      /* 弹出错误原因 */
      load.error(e.message);
    }).finally(() => {
      /* 关闭加载效果 */
      load.loaded();
      loaded.value = true;
    });

  } catch (e) {
    console.log(e)
    load.error(e);
  }
}

</script>

<style lang="scss" scoped>

:global(.self-popup) {
  background-color: #f7f7f7 !important;
}

.panel-edit {
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  height: 100%;
  overflow: hidden;

  .title {
    width: 100%;
    flex-shrink: 0;
    @include flex-center;
    color: $sm-color;
    font-size: $font-size-1;
    padding-bottom: 10px;
  }


  .edit {
    margin: 0;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 0 15px 0;

  }

  .bottom-button {
    flex-shrink: 0;
    padding: 10px 30px;
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
    border: 1px $primary-color solid;
    margin: 20px 15% 15px;
    width: 70%;
  }

}


.skeleton {
  padding: 30px 5px;
  --van-skeleton-paragraph-background: #e3e3e3;
}

</style>