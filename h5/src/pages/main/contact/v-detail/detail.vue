<template>

  <van-popup
      v-model:show="detail_visible"
      closeable
      round
      position="bottom"
      class="self-popup"
      :style="{ height: '80%' }"
  >

    <div class="panel-detail" v-if="loaded">

      <!-- 标题 -->
      <div class="title">{{ customer.detail.name }}</div>

      <div class="detail" ref="container">

        <van-cell-group inset>
          <!-- 输入任意文本 -->
          <van-field :readonly="readonly" v-model="customer.detail.name" label="姓名"/>
          <!-- 输入手机号，调起手机号键盘 -->
          <van-field :readonly="readonly" v-model="customer.detail.mobile" label="手机号"/>
          <!-- 输入手机号，调起手机号键盘 -->
          <van-field :readonly="readonly" v-model="customer.detail.next_dial" label="上次联系"/>
          <!-- 输入手机号，调起手机号键盘 -->
          <van-field :readonly="readonly" :modelValue="customer.detail.count_dial+'次'" label="通话次数"/>
          <!-- 输入手机号，调起手机号键盘 -->
          <van-field :readonly="readonly" :modelValue="customer.detail.duration_dial+'秒'" label="通话时长"/>
          <!-- 允许输入正整数，调起纯数字键盘-->
          <van-field :readonly="readonly" v-model="customer.detail.company" label="公司名称"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="readonly" v-model="customer.detail.bank" label="开户行"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="readonly" v-model="customer.detail.create" label="成立日期"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="readonly" v-model="customer.detail.scale" label="企业规模"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="readonly" v-model="customer.detail.tax" label="税号"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="readonly" v-model="customer.detail.area" label="地区"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="readonly" v-model="customer.detail.industry" label="行业"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="readonly" v-model="customer.detail.to_year" label="年开票"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="readonly" v-model="customer.detail.toTax" label="年纳税"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="readonly" :modelValue='["A", "B", "C", "D", "M"][customer.detail.level - 1]'
                     label="税务评级"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="true" placeholder="请选择客户评级"
                     :modelValue='!customer.detail.star?"暂无":(customer.detail.star+"星")'
                     label="客户评级"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="readonly" v-model="customer.detail.sell_year" label="年销售"/>
          <!-- 文本域自适应文字高度 -->
          <van-field :readonly="readonly" autosize type="textarea" v-model="customer.detail.remarks" label="备注"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="readonly" v-model="customer.detail.assign_time" label="分配日期"/>
          <!-- 允许输入正整数，调起纯数字键盘 -->
          <van-field :readonly="readonly" v-model="customer.detail.datetime" label="导入日期"/>
        </van-cell-group>

      </div>
    </div>

    <div v-else class="skeleton">
      <van-skeleton title :row="5"/>
    </div>

  </van-popup>

</template>

<script setup>
import {inject, reactive, ref, watch} from "vue";
import api from "@/service/api";
import axios from "axios";
import load from "@/common/usual/load";

const detail_visible = inject('detail_visible');
const select_detail_customer = inject('select_detail_customer');
const loaded = ref(false); //数据是否已加载
const customer = reactive({detail: null}); //所有标签
const readonly = ref(true); //只读

/**
 * 加载所有标签
 */
const loadDetail = () => {

  try {
    /* 开始请求 */
    axios.get(api.detail + "?id=" + select_detail_customer.data.id)
        .then((res) => {
          /*
          * 判断请求结果
          * */
          if (res.data.code) {
            customer.detail = res.data.data;
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
watch(() => detail_visible, () => {
  if (detail_visible.value) {
    loaded.value = false;
    loadDetail(); //加载用户数据
  }
}, {
  deep: true
})


</script>

<style lang="scss" scoped>


.panel-detail {
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


  .detail {
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