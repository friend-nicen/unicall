<template>
  <template v-if="loaded">
    <div ref="container" class="detail">
      <van-form ref="formRef" style="width: 100%;">
        <fields-form v-model="detail" :fields="form_mod"/>
        <van-field :modelValue="detail.last_call ? detail.last_call : '无'" :readonly="true" label="上次联系"/>
        <van-field :modelValue="detail.last_follow  ? detail.last_follow : '无'" :readonly="true" label="上次跟进"/>
        <van-field :modelValue="detail.assign_time" :readonly="true" label="分配日期"/>
        <van-field :modelValue="detail.create_time" :readonly="true" label="导入日期"/>
      </van-form>
    </div>

    <div class="fix-button">
      <van-button
          class="bottom-button"
          plain round
          size="small"
          type="primary"
          @click="onSubmit">
        修改信息
      </van-button>
    </div>

  </template>
  <div v-else class="skeleton">
    <van-loading size="24px"></van-loading>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {injects, switchForm} from "@/common";
import FieldsForm from "./form.vue";
import api from "@/service/api";
import load from "@/common/load";
import sys from "@/stores/sys";
import axios from "axios";


/* 事件 */
const loaded = ref(false);

/* 数据 */
const detail = ref({});
const formRef = ref(null);

/* 客户名称 */
const name = ref('');

/* 状态 */
const {
  select_detail: customer,
  status,
  intent
} = injects([
  "select_detail",
  "status",
  "intent"
]);


/* 表单配置 */
const form_mod = [
  {
    key: 'name',
    type: 'input',
    label: '客户名称',
    attr: {
      required: true,
      placeholder: '请输入客户名称'
    }
  },
  {
    key: 'status',
    type: 'select',
    label: '客户状态',
    attr: {
      placeholder: '请选择客户状态',
      options: (status.value || []).map((lbl, idx) => ({label: lbl, value: idx}))
    }
  },
  {
    key: 'intent',
    type: 'select',
    label: '客户意向',
    attr: {
      placeholder: '请选择客户意向',
      options: (intent.value || []).map(i => ({label: i.label, value: i.value}))
    }
  },
  {
    key: 'remark',
    type: 'input',
    label: '备注',
    attr: {
      placeholder: '请输入备注信息'
    }
  },
]

/* 增加自定义字段的表单 */
sys.fields.forEach(item => {
  const cfg = {
    key: item.key,
    type: item.type,
    label: item.label,
    attr: {
      required: item.required,
      placeholder: (String(item.type).indexOf('input') > -1 ? '请输入' : '请选择') + item.label
    }
  }
  if (!!item.options) {
    cfg.attr.options = Array.isArray(item.options)
        ? item.options
        : String(item.options).split(',').map(i => ({label: i, value: i}))
  }
  const index = item.form > (form_mod.length - 1) ? (form_mod.length - 2) : item.form
  form_mod.splice(index, 0, cfg)
})


/* 修改 */
const onSubmit = () => {
  try {
    formRef.value?.validate()
        .then(() => {

          axios.post(api.custs.modify, switchForm(Object.assign(
              {id: customer.value.id},
              detail.value || {}
          )))
              .then((res) => {
                /* 判断请求结果 */
                if (res.data.code) {
                  /* 同步修改 */
                  Object.assign(customer.value, detail.value || {});
                  load.toast("修改成功");
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
        }).catch(() => {
    })
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
    /* 开始请求 */
    axios.get(`${api.custs.detail}?id=${customer.value.id}`)
        .then((res) => {
          if (res.data.code) {

            /* 客户基础信息 */
            detail.value = res.data.data;
            name.value = detail.value.name;

            /* 合并自定义字段的值 */
            if ('json' in detail.value && !!detail.value.json) {
              try {
                Object.assign(detail.value, JSON.parse(detail.value.json));
                delete detail.value.json
              } catch (e) {
                console.log(e);
              }
            }

            /* 补充默认值 */
            (sys.fields || []).forEach(item => {
              if (!(item.key in detail.value)) detail.value[item.key] = null
            })

            /* 展示 */
            if (!loaded.value) loaded.value = true;

          } else {
            load.toast(res.data.errMsg);
          }

        }).catch((e) => {
      load.toast(e.message);
    });
  } catch (e) {
    console.log(e)
    load.toast(e);
  }
}

/* 初始化 */
onMounted(() => loadDetail());

</script>

<style lang="scss" scoped>

.detail {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 15px 0;
  margin: 12px 12px 50px;
  border-radius: 12px;
  background-color: #ffffff;

  :deep(.van-field__label) {
    &:before {
      margin-right: 2px;
      color: transparent;
      content: "*";
    }
  }

  :deep(.van-field__label--required) {
    &:before {
      color: var(--van-field-required-mark-color);
    }
  }
}

.fix-button {
  @include flex-center;
  background-color: #ffffff;
  position: fixed;
  width: calc(100% - 24px);
  border-radius: 12px;
  right: 12px;
  bottom: 0;

  .bottom-button {
    margin: 15px 0 15px;
    width: 50%;
  }
}
</style>
